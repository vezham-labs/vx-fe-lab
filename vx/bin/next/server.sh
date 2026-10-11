#!/bin/bash

if [ -n "$1" ] && [ -d "$1" ]; then
    cd "$1" || exit 1
    shift
fi

# wjdlz/NOTE: export ENV var if exists
if [ -f .env ]; then
    set -o allexport
    source .env
    set +o allexport
fi

# Args:
# $1 - optional app root when it points to a directory
# next arg (now $1) - serve mode after shifting app root (dev, start, ...)
serve=${1:-"dev"}
# local vars
hostname=${HOST_NAME:-"localhost"}
port=${PORT:-"3000"}
max_port_attempts=${PORT_ATTEMPTS:-"10"}

pre_setup() {
    if [ -n "$CI" ]; then
        hostname="localhost"
    fi

    if [ "$serve" = "start" ]; then
        port=${PRE_PORT:-"8080"}
    fi
}

is_port_available() {
    local candidate_port=$1

    if command -v lsof >/dev/null 2>&1; then
        ! lsof -nP -iTCP:"$candidate_port" -sTCP:LISTEN >/dev/null 2>&1
        return
    fi

    return 0
}

pick_available_port() {
    local candidate_port=$port
    local attempts=0

    while [ "$attempts" -lt "$max_port_attempts" ]; do
        if is_port_available "$candidate_port"; then
            if [ "$candidate_port" != "$port" ]; then
                echo "Port $port is in use. Using $candidate_port instead."
            fi

            port=$candidate_port
            return 0
        fi

        echo "Port $candidate_port is in use. Trying $((candidate_port + 1))..."
        candidate_port=$((candidate_port + 1))
        attempts=$((attempts + 1))
    done

    echo "No available port found from $port to $((port + max_port_attempts - 1))." >&2
    return 1
}

main() {
    pre_setup
    pick_available_port || exit 1
    next $serve --hostname $hostname --port $port # NODE_OPTIONS=--max-old-space-size=12288 
}

# Run main function
main
