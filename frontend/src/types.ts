export interface Station {
  code: string;
  name: string;
  lat: number;
  lon: number;
}

export interface Section {
  id: string;
  station_from: string;
  station_to: string;
  distance_km: number;
}

export interface PlanTask {
  task_id: string;
  asset_id: string;
  block_id: string;
  section_id: string;
  corridor_id?: string;
  corridor_name?: string;
  date: string;
  window_start: string;
  window_end: string;
  task_type: string;
  department: string;
  crew_type?: string;
  priority: string;
  required_duration_min: number;
  duration?: number;
  overdue_days: number;
  safety_critical: boolean;
  is_joint_possession?: boolean;
  coordination_status?: string;
  bundled_with?: string;
  downtime_saved_min?: number;
  freight_density?: string;
  power_isolation_required?: string;
  restrictions?: string;
  planning_status?: string;
  approval_status?: string;
  approved_by?: string;
  approval_remarks?: string;
  approved_at?: string;
  solver?: string;
}

export interface MaintenanceTaskItem {
  id: string;
  asset_id: string;
  department_id: string;
  task_type: string;
  priority_class: string;
  required_duration_min: number;
  days_since_last_maintenance?: number;
  overdue_days?: number;
  safety_critical: boolean;
  dependency_group?: string;
  crew_type?: string;
}

export interface AssetItem {
  id: string;
  department_id: string;
  asset_type: string;
  section_id: string;
  location_km?: number;
  installation_date?: string;
  criticality_class?: string;
  safety_flag?: boolean;
  condition_score?: number;
}

export interface BlockWindowItem {
  id: string;
  section_id: string;
  date: string;
  window_start: string;
  window_end: string;
  max_duration_min: number;
  power_block_allowed?: boolean;
  track_block_allowed?: boolean;
  signal_block_allowed?: boolean;
  availability_status?: string;
}

export interface ConflictItem {
  id: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  title: string;
  section_id: string;
  department: string;
  description: string;
  suggested_action: string;
  timestamp: string;
}

export interface DataIntegration {
  id: string;
  name: string;
  department: string;
  status: string;
  record_count: number;
  detail: string;
  last_sync: string;
  latency_ms: number;
  feed_type: string;
  protocol: string;
}

export interface GoodsForecastItem {
  id: string;
  forecast_date: string;
  corridor_id: string;
  zone: string;
  density_tier: string;
  predicted_goods_trains: number;
  lower_bound: number;
  upper_bound: number;
  forecast_horizon_days: number;
  data_source: string;
}

export interface RouteAnalysisResult {
  section_id: string;
  from_station: Station;
  to_station: Station;
  distance_km: number;
  block_required: boolean;
  verdict: string;
  risk_probability: number;
  confidence_tier: string;
  priority_class: string;
  recommended_window: string;
  estimated_duration_min: number;
  departments_involved: string[];
  factors_increasing_risk: string[];
  factors_reducing_risk: string[];
  summary: string;
  prediction_mode?: string;
  telemetry_source?: string;
}

export interface ModelHealth {
  version?: string;
  primary_target?: string;
  split_method?: string;
  status?: string;
  model_file?: string;
  artifact_exists?: boolean;
  model_type?: string;
  provenance?: string;
  is_production_validated?: boolean;
  features_expected?: number;
  metrics?: {
    pr_auc?: number;
    recall?: number;
    precision?: number;
    brier_score?: number;
  };
}
