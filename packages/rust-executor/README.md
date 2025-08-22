# Rust Workflow Executor

This crate contains a Rust implementation of the SimStudio workflow executor. The goal is to provide a more performant alternative to the existing TypeScript executor for computationally intensive workflows.

## Building

To build the executor, run the following command from the root of the monorepo:

```sh
bun run build:rust
```

Alternatively, you can build it directly using Cargo from within this directory:

```sh
cargo build
```

### Note on the Development Environment

There is a known, persistent issue in the current development environment that prevents `cargo build` from completing successfully. The command fails with the following error:

```
error: Unable to proceed. Could not locate working directory.: No such file or directory (os error 2)
```

This issue appears to be related to the sandboxed environment's filesystem and how it interacts with Cargo. All attempts to diagnose and fix this have failed. Therefore, while the source code is present, it cannot be compiled in the current environment.
