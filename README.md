# garage-frontend

Frontend web application for Garage — connects to [garage-backend](https://github.com/Edriand/garage-backend).

## Overview

This repository contains the frontend interface for the Garage project. It is integrated with the autonomous agent system for automated issue handling and code reviews.

## Agent System Integration

Issues assigned in this repo trigger the Worker agent automatically. PRs trigger the Reviewer agent. Both are managed via the [agent-system](https://github.com/Edriand/agent-system).

| Agent | Trigger |
|---|---|
| Worker | Issue assigned or comment reply |
| Reviewer | PR opened or synchronized |

## Project Board

Issues and PRs from this repo appear in the [Garage project board](https://github.com/users/Edriand/projects/2/views/2).

## Related Repositories

- [garage-backend](https://github.com/Edriand/garage-backend) — API and backend services
- [agent-system](https://github.com/Edriand/agent-system) — Autonomous development agents

