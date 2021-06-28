

# Gene Annotation Visualizer


1. Install the dependencies. Make sure that you use Yarn 1.0.0 or higher.

```
yarn
```

You can use NPM instead of Yarn to handle the project dependencies and to run scripts. Throughout the Apollo
Universal project documentation, we'll always use Yarn.

3. Seed sample data to the database. The command below will create new tables with sample data in SQLite:

```
yarn seed
```

SQLite is a typical default relational database installed in most Linux distributions including Mac OS X; otherwise,
consult [SQLite installation guide].

4. Run the project in development mode:

```
yarn watch
```

The server application will be running on [http://localhost:3000], while the client application will be running on
[http://localhost:8080]. The terminal will tell your the exact ports.

For more information about running this project for mobile development or Docker, consult the [Getting Started]
guide.

## Project Structure

The project structure presents generally accepted guidelines and patterns for building scalable web and mobile
applications.

The structure is _fractal_ meaning the available functionality is grouped primarily by feature rather than by file type.
But the current structure isn't prescriptive, and you can change it however you like.

```
gene_annotation_visualization
├── config                      # Various application configurations
├── docs                        # Documentation
├── node_modules                # Global Node.js modules
├── modules                     # All the prebuilt project modules
├── packages                    # Available packages
│   ├── client                  # React client
│   ├── common                  # Common code
│   ├── server                  # Node.js and Express server
└── tools                       # All build and CLI-related files
```

Inside `modules`, you'll find all the prebuilt modules that this project comes with. Each module under
`modules` contains sub-directories with module implementations for different technologies. For example, if you look up
the module `modules/core`, you'll see the following sub-modules:

```
gene_annotation_visualization
├── modules                       # Available packages
│   ├── core                      # The core module
│       ├── client-react          # Core functionality for React app
│       ├── common                # React Native mobile client
│       └── server-ts             # Core functionality for Express server
└── tools                         # All build and CLI-related files
```