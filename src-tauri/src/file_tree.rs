use std::{fs, path::PathBuf};
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
pub(crate) struct TreeNode {
    path: String,
    is_folder: bool,
    children: Vec<TreeNode>,
}

impl TreeNode {
    fn new(path: String, is_folder: bool) -> TreeNode {
        TreeNode {
            path,
            is_folder,
            children: Vec::new(),
        }
    }
}

pub(crate) fn build_tree(root_path: PathBuf) -> TreeNode {
    build_tree_recursive(&root_path)
}

fn build_tree_recursive(path: &PathBuf) -> TreeNode {
    let path_string = path.as_path().to_string_lossy().to_string();

    let is_folder = path.is_dir();
    let mut current_node = TreeNode::new(path_string, is_folder);

    if is_folder {
        if let Ok(entries) = fs::read_dir(path) {
            for child in entries.filter_map(|entry| entry.ok()) {
                let child_path = child.path();
                let child_node = build_tree_recursive(&child_path);
                current_node.children.push(child_node);
            }
        }
    }

    current_node
}