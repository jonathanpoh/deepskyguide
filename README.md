# Deep Sky Guide

> A useful tool for astrophotography planning of deep-sky objects.

This is a command-line application that uses AI to provide expert guidance for deep-sky object astrophotography, powered by the OpenRouter API.

## Prerequisites

This project is built with [Deno](https://deno.com/), a modern and secure runtime for JavaScript and TypeScript.

- **Install Deno:** Follow the official installation instructions at [deno.com/manual/getting_started/installation](https://deno.com/manual/getting_started/installation).

## Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/jonathanpoh/deepskyguide.git
    cd deepskyguide
    ```

2.  **Set up environment variables:**
    The application requires an API key to communicate with the OpenRouter service.
    -   Copy the example environment file:
        ```bash
        cp .env.example .env
        ```
    -   Open the newly created `.env` file and add your secret API key from OpenRouter.ai.

## Usage

To run the application, use the Deno task runner. This command, defined in `deno.jsonc`, will automatically apply the necessary permissions for network, file, and environment access.

```bash
deno task start
```