#!/usr/bin/env bash

ports="${1:-}"
missing='{args.port}'

if [ -z "$ports" ] || [ "$ports" = "$missing" ]; then
    read -r -p "Ports or ranges to kill (e.g. 3000,3005-3010): " ports
fi

ports=$(printf '%s' "$ports" | tr ',' ' ')

if [ -z "$ports" ]; then
    echo "No ports provided" >&2
    exit 1
fi

kill_port() {
    port="$1"

    case "$port" in
        '' | *[!0-9]*)
            echo "Skipping invalid port: $port" >&2
            return
            ;;
    esac

    if [ "$port" -lt 1 ] || [ "$port" -gt 65535 ]; then
        echo "Skipping invalid port: $port" >&2
        return
    fi

    # Only stop TCP listeners; connected clients may belong to other apps.
    pids=$(lsof -nP -tiTCP:"$port" -sTCP:LISTEN)

    if [ -z "$pids" ]; then
        echo "No TCP listener found on port $port"
    else
        kill -9 $pids && echo "Killed process(es) on port $port"
    fi
}

for ports_or_range in $ports; do
    case "$ports_or_range" in
        *-*)
            range_start=${ports_or_range%-*}
            range_end=${ports_or_range#*-}

            case "$range_start:$range_end" in
                *[!0-9:]* | :* | *:)
                    echo "Skipping invalid port range: $ports_or_range" >&2
                    continue
                    ;;
            esac

            if [ "$range_start" -gt "$range_end" ]; then
                echo "Skipping invalid port range: $ports_or_range" >&2
                continue
            fi

            port=$range_start
            while [ "$port" -le "$range_end" ]; do
                kill_port "$port"
                port=$((port + 1))
            done
            ;;
        *)
            kill_port "$ports_or_range"
            ;;
    esac
done
