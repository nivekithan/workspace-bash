My current `~/.bashrc`

```bash

# Workspace Related code

function workspace() {
    export WORKSPACE_CONFIG="$HOME/.config/workspace/workspace_config.json"
    export WORKSPACE_OUTPUT="$HOME/.config/workspace/workspace_output"
    export WORKSPACE_DEFAULT_ACTIVE="1" # actual workspace

    WORKSPACE_SCRIPT="$HOME/code/workspace-bash/build/index.js"
    node $WORKSPACE_SCRIPT $1

    chmod +x $WORKSPACE_OUTPUT
    . $WORKSPACE_OUTPUT
}

workspace
```

To set new workspace I have to run

```bash
workspace new_workspace
```

And all envrironment variable will be updated based on `$WORKSPACE_CONFIG` and `active_workspace`
