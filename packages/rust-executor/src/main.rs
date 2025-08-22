use std::collections::{HashMap, HashSet};
use std::io::{self, Read};

mod types;
use types::{
    BlockState, ExecutionContext, ExecutionResult, NormalizedBlockOutput, SerializedBlock,
    SerializedWorkflow,
};

fn main() {
    let mut buffer = String::new();
    io::stdin().read_to_string(&mut buffer).unwrap();

    let workflow: SerializedWorkflow = serde_json::from_str(&buffer).unwrap();

    let result = execute_workflow(workflow);

    let json_result = serde_json::to_string_pretty(&result).unwrap();
    println!("{}", json_result);
}

fn execute_workflow(workflow: SerializedWorkflow) -> ExecutionResult {
    let mut context = ExecutionContext {
        workflow_id: "test-workflow".to_string(),
        block_states: HashMap::new(),
        executed_blocks: HashSet::new(),
        active_execution_path: HashSet::new(),
        workflow: Some(workflow.clone()),
    };

    let starter_block = match find_starter_block(&workflow) {
        Some(block) => block,
        None => {
            return ExecutionResult {
                success: false,
                output: NormalizedBlockOutput { extra: HashMap::new() },
                error: Some("No starter block found".to_string()),
            };
        }
    };

    context.executed_blocks.insert(starter_block.id.clone());
    context.active_execution_path.insert(starter_block.id.clone());
    context.block_states.insert(
        starter_block.id.clone(),
        BlockState {
            output: NormalizedBlockOutput { extra: HashMap::new() },
            executed: true,
            execution_time: 0.0,
        },
    );

    let mut current_blocks = get_next_blocks(&starter_block.id, &workflow, &context);

    while !current_blocks.is_empty() {
        let mut next_block_ids = Vec::new();
        for block_id in current_blocks {
            // In a real implementation, we would execute the block here.
            // For now, we'll just mark it as executed and create dummy output.
            let mut output_data = HashMap::new();
            output_data.insert(
                "message".to_string(),
                serde_json::Value::String(format!("Executed block {}", block_id)),
            );

            let output = NormalizedBlockOutput { extra: output_data };

            context.executed_blocks.insert(block_id.clone());
            context.block_states.insert(
                block_id.clone(),
                BlockState {
                    output,
                    executed: true,
                    execution_time: 1.0,
                },
            );

            next_block_ids.extend(get_next_blocks(&block_id, &workflow, &context));
        }
        current_blocks = next_block_ids;
    }

    let final_output = context
        .block_states
        .get(&workflow.blocks.last().unwrap().id)
        .map(|s| s.output.clone())
        .unwrap_or(NormalizedBlockOutput { extra: HashMap::new() });

    ExecutionResult {
        success: true,
        output: final_output,
        error: None,
    }
}

fn find_starter_block(workflow: &SerializedWorkflow) -> Option<&SerializedBlock> {
    workflow
        .blocks
        .iter()
        .find(|b| b.metadata.as_ref().map_or(false, |m| m.id == "starter"))
}

fn get_next_blocks(
    current_block_id: &str,
    workflow: &SerializedWorkflow,
    context: &ExecutionContext,
) -> Vec<String> {
    workflow
        .connections
        .iter()
        .filter(|c| c.source == current_block_id)
        .map(|c| c.target.clone())
        .filter(|target_id| !context.executed_blocks.contains(target_id))
        .collect()
}
