#!/bin/bash

source $(dirname "$0")/helpers.sh

# declare an array of urls
urls=(
  # https://raw.githubusercontent.com/mullvad/dns-blocklists/main/output/doh/doh_adblock.txt
  # https://raw.githubusercontent.com/mullvad/dns-blocklists/main/output/doh/doh_gambling.txt
  # https://raw.githubusercontent.com/mullvad/dns-blocklists/main/output/doh/doh_privacy.txt
  # https://raw.githubusercontent.com/FadeMind/hosts.extras/master/add.Risk/hosts
  # https://raw.githubusercontent.com/DandelionSprout/adfilt/master/Alternate%20versions%20Anti-Malware%20List/AntiMalwareHosts.txt
  # https://adaway.org/hosts.txt
  # https://raw.githubusercontent.com/StevenBlack/hosts/master/hosts
  # https://raw.githubusercontent.com/bigdargon/hostsVN/master/hosts
  # https://adguardteam.github.io/AdGuardSDNSFilter/Filters/filter.txt
  # https://raw.githubusercontent.com/hagezi/dns-blocklists/main/domains/light.txt
  # https://raw.githubusercontent.com/bigdargon/hostsVN/master/option/domain.txt
  # https://raw.githubusercontent.com/hagezi/dns-blocklists/main/wildcard/gambling-onlydomains.txt
  https://raw.githubusercontent.com/hagezi/dns-blocklists/main/wildcard/light-onlydomains.txt
  # https://raw.githubusercontent.com/hagezi/dns-blocklists/main/wildcard/doh-onlydomains.txt
)

# download all files in parallel and append them to input.csv
download_lists $urls 'input.csv'

# print a message when done
echo "Done. The input.csv file contains merged data from recommended filter lists."
