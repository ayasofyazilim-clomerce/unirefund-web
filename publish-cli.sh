#!/bin/bash
# Colors
RED='\e[31m'
GREEN='\e[32m'
YELLOW='\e[33m'
BLUE='\e[34m'
BOLD='\e[1m'
RESET='\e[0m'
system_ports=($(netstat -tuln | grep -oP ':\K\d+' | sort -un))
options=("all" "quit")
selected_ports=()

PS3='Please select apps to publish: '
options=("all" "quit")
for dir in ./apps/*/; do
    dir_name=$(basename "$dir")    
    options+=("$dir_name")
done
apps_to_publish=()

validate_port() {
    if [[ $1 -ge 1 && $1 -le 65535 ]]; then
        return 0
    else
        echo -e "${RED}Invalid port number. Please enter a value between 1 and 65535.${RESET}"
        return 1
    fi
}

get_app_details() {
    local app=$1
    local port=$2
    if [[ -n $port ]]; then
        app_port=$port
    else        
        while true; do
            echo -e "${BOLD}${YELLOW}\nWarning: The following ports are currently in use: ${system_ports[*]}${RESET}\n"
            read -p "Please provide port number for $app: " app_port
            validate_port $app_port || continue
            port_in_use=false
            for used_port in "${selected_ports[@]}"; do
                if [[ $app_port -eq $used_port ]]; then
                    echo -e "${RED}Port $app_port is already in use by another app. Please choose a different port.${RESET}"
                    port_in_use=true
                    break
                fi
            done
            [[ $port_in_use == false ]] && break
        done
    fi

    # Check for .env file
    if [[ ! -f "./apps/${app,,}/.env" ]]; then
        echo -e "${RED}Error: .env file does not exist for $app. Please create one before proceeding.${RESET}"
        exit 1
    fi

    echo -e "${GREEN}App name for $app is set to $app${RESET}"
    echo -e "${GREEN}Port number for $app is set to $app_port${RESET}"
    eval "${app,,}_app=\$app"
    eval "${app,,}_port=\$app_port"
    selected_ports+=($app_port)
}

update_code_from_remote() {
    echo -e "${BOLD}${BLUE}Pulling code from remote..${RESET}\n"
    git reset --hard origin/main && git pull --recurse-submodules
}

start_app() {    
    local app=$1
    local app_port_var="${app,,}_port"
    local app_port=${!app_port_var}
    local env_name=$(basename "$(pwd)")
    local project_name=$(basename "$(dirname "$(pwd)")")
    local app_name="[$app_port][${env_name^^}]${project_name^}($app)"
    echo -e $app_name
    pnpm run build --filter "./apps/${app,,}"
    echo -e "${BOLD}${BLUE}\nStarting $app_name..${RESET}\n"
    if pm2 pid "$app_name"; then
        pm2 delete "$app_name"
    fi
    cd "apps/${app,,}"
    pm2 start "pnpm start --port $app_port" -n "$app_name"
    echo -e "${BOLD}${BLUE}\n$app_type Started${RESET}\n"
    cd ../..
}

if [[ $# -eq 0 ]]; then
    select opt in "${options[@]}"
    do
        case $opt in
            "all")
                for app in "${options[@]}"; do
                    [[ $app == "all" || $app == "quit" ]] && continue
                    get_app_details "$app"
                    apps_to_publish+=("$app")
                done
                break
                ;;
            "quit")
                exit 1
                ;;
            *) 
                get_app_details "$opt"
                apps_to_publish+=("$opt")
                break
                ;;
        esac
    done
else
    while [[ $# -gt 0 ]]; do
        case $1 in
            --app)
                app=$2
                shift 2
                ;;
            --port)
                port=$2
                shift 2
                ;;
            *)
                echo -e "${RED}Unknown option: $1${RESET}"
                exit 1
                ;;
        esac
        if [[ -n $app && -n $port ]]; then
            get_app_details "$app" "$port"
            apps_to_publish+=("$app")
            unset app
            unset port
        fi
    done
fi

update_code_from_remote
echo -e "${BOLD}${BLUE}\nStarting setup for ${apps_to_publish[*]}..${RESET}\n"
pnpm install

for app in "${apps_to_publish[@]}"; do
    start_app "$app"
done
