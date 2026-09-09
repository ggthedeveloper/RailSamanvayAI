from pathlib import Path

import pandas as pd

from app.db.database import SessionLocal
from app.db.models import Asset, Department, Section


# Project root:
# C:\Users\User\Downloads\RailSamanvayAI-main
BASE_DIR = Path(__file__).resolve().parents[1]

# CSV location:
# C:\Users\User\Downloads\RailSamanvayAI-main\data\raw
DATA_DIR = BASE_DIR / "data" / "raw"


def clean_text(value):
    """Convert a CSV value into clean text."""
    if pd.isna(value):
        return None

    text = str(value).strip()

    if text.lower() in {"", "nan", "none"}:
        return None

    return text


def clean_float(value):
    """Convert a CSV value into a float."""
    try:
        if pd.isna(value):
            return None

        return float(value)

    except (ValueError, TypeError):
        return None


def clean_date(value):
    """Convert a CSV date into a Python datetime."""
    if pd.isna(value):
        return None

    parsed_date = pd.to_datetime(value, errors="coerce")

    if pd.isna(parsed_date):
        return None

    return parsed_date.to_pydatetime()


def get_or_create_department(db, department_name):
    """
    Find an existing department.
    If it does not exist, create it.
    """

    if not department_name:
        return None

    department_id = (
        department_name.upper()
        .replace(" ", "_")
        .replace("-", "_")
    )

    department = (
        db.query(Department)
        .filter(Department.id == department_id)
        .first()
    )

    if department:
        return department_id

    department = Department(
        id=department_id,
        name=department_name,
    )

    db.add(department)

    # Make the new department available immediately
    # during this same database transaction.
    db.flush()

    return department_id


def get_or_create_section(db, corridor_id):
    """
    Find an existing corridor/section.
    If it does not exist, create it.
    """

    if not corridor_id:
        return None

    section = (
        db.query(Section)
        .filter(Section.id == corridor_id)
        .first()
    )

    if section:
        return corridor_id

    section = Section(
        id=corridor_id,
        station_from=None,
        station_to=None,
        distance_km=None,
    )

    db.add(section)

    # Make the new section available immediately.
    db.flush()

    return corridor_id


def import_assets():
    csv_path = DATA_DIR / "assets.csv"

    if not csv_path.exists():
        print(f"ERROR: File not found: {csv_path}")
        return

    print(f"Reading: {csv_path}")

    try:
        df = pd.read_csv(csv_path)
    except Exception as error:
        print("ERROR while reading the CSV file:")
        print(error)
        return

    required_columns = [
        "asset_id",
        "asset_type",
        "corridor_id",
        "department",
        "asset_location",
        "criticality",
        "installation_date",
        "condition_score",
    ]

    for column in required_columns:
        if column not in df.columns:
            print(f"ERROR: Missing column: {column}")
            return

    db = SessionLocal()

    imported = 0
    skipped = 0

    try:
        for _, row in df.iterrows():

            asset_id = clean_text(row["asset_id"])
            asset_type = clean_text(row["asset_type"])
            corridor_id = clean_text(row["corridor_id"])
            department_name = clean_text(row["department"])

            # Skip rows without the minimum required information.
            if not asset_id or not asset_type:
                skipped += 1
                continue

            # Create or reuse the department.
            department_id = get_or_create_department(
                db,
                department_name,
            )

            # Create or reuse the corridor/section.
            section_id = get_or_create_section(
                db,
                corridor_id,
            )

            criticality = clean_text(row["criticality"])

            # Mark high-criticality assets as safety-critical.
            safety_flag = False

            if criticality:
                safety_flag = criticality.upper() in {
                    "HIGH",
                    "CRITICAL",
                    "SAFETY",
                    "SAFETY-CRITICAL",
                    "SAFETY_CRITICAL",
                }

            # Check whether the asset already exists.
            asset = (
                db.query(Asset)
                .filter(Asset.id == asset_id)
                .first()
            )

            if asset:
                # Update the existing asset.
                print(f"Updating asset: {asset_id}")
            else:
                # Create a new asset.
                print(f"Adding asset: {asset_id}")
                asset = Asset(id=asset_id)
                db.add(asset)

            # Map CSV columns to database fields.
            asset.asset_type = asset_type
            asset.department_id = department_id
            asset.section_id = section_id
            asset.location_km = clean_float(
                row["asset_location"]
            )
            asset.installation_date = clean_date(
                row["installation_date"]
            )
            asset.criticality_class = criticality
            asset.safety_flag = safety_flag
            asset.condition_score = clean_float(
                row["condition_score"]
            )

            imported += 1

        # Save all changes.
        db.commit()

        print()
        print(f"Successfully imported/updated {imported} assets.")
        print(f"Skipped {skipped} rows.")

    except Exception as error:
        db.rollback()

        print()
        print("ERROR while importing assets:")
        print(error)

    finally:
        db.close()


if __name__ == "__main__":
    import_assets()