import os
import sys
import argparse

# Add backend app to path
_base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(_base_dir, "backend"))

from app.db.database import SessionLocal, engine
from app.db.models import Base

def seed_db(rebuild=False, force=False):
    if not (rebuild and force):
        print("\n[SAFETY GUARD] seed_database will NOT execute without explicit confirmation.")
        print("To safely rebuild the database from REAL datasets under data/raw, run:")
        print("    python scripts/seed_database.py --rebuild --force\n")
        sys.exit(0)

    print("[WARNING] Rebuilding database tables from canonical schemas...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    print("[IMPORT] Running deterministic import scripts from data/raw/ ...")
    import import_csv_data
    import import_assets
    import import_corridor_availability
    import import_block_requests
    import import_maintenance_tasks
    import import_maintenance_history
    import import_goods_forecast
    import import_train_movements

    print("\n[SUCCESS] Deterministic database initialization complete with real Indian Railways data.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Deterministic database seed from real data/raw datasets.")
    parser.add_argument("--rebuild", action="store_true", help="Confirm database schema recreation")
    parser.add_argument("--force", action="store_true", help="Force overwrite existing data")
    args = parser.parse_args()

    seed_db(rebuild=args.rebuild, force=args.force)
