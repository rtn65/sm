use serde::{Deserialize, Serialize};
use std::collections::{HashMap, HashSet};

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SerializedWorkflow {
    pub version: String,
    pub blocks: Vec<SerializedBlock>,
    pub connections: Vec<SerializedConnection>,
    #[serde(default)]
    pub loops: HashMap<String, SerializedLoop>,
    #[serde(default)]
    pub parallels: HashMap<String, SerializedParallel>,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SerializedConnection {
    pub source: String,
    pub target: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub source_handle: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub target_handle: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SerializedBlock {
    pub id: String,
    pub position: Position,
    pub config: BlockConfig,
    pub inputs: HashMap<String, serde_json::Value>,
    pub outputs: HashMap<String, serde_json::Value>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub metadata: Option<BlockMetadata>,
    pub enabled: bool,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Position {
    pub x: f64,
    pub y: f64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct BlockConfig {
    pub tool: String,
    pub params: HashMap<String, serde_json::Value>,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BlockMetadata {
    pub id: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub name: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub category: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SerializedLoop {
    pub id: String,
    pub nodes: Vec<String>,
    pub iterations: i64,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub loop_type: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub for_each_items: Option<serde_json::Value>,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SerializedParallel {
    pub id: String,
    pub nodes: Vec<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub distribution: Option<serde_json::Value>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub count: Option<i64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub parallel_type: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct NormalizedBlockOutput {
    #[serde(flatten)]
    pub extra: HashMap<String, serde_json::Value>,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BlockState {
    pub output: NormalizedBlockOutput,
    pub executed: bool,
    pub execution_time: f64,
}

#[derive(Debug, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ExecutionContext {
    pub workflow_id: String,
    #[serde(default)]
    pub block_states: HashMap<String, BlockState>,
    #[serde(default)]
    pub executed_blocks: HashSet<String>,
    #[serde(default)]
    pub active_execution_path: HashSet<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub workflow: Option<SerializedWorkflow>,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ExecutionResult {
    pub success: bool,
    pub output: NormalizedBlockOutput,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub error: Option<String>,
}
