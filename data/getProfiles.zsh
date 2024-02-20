#!/bin/zsh

#INITIAL_WORKING_DIRECTORY=$(pwd)
cd "$(dirname "$0")"

output=()
jq -cr '.data.children[].data.author' ./react.json | while read i; do

	filter=(jq -s '.[0]+ {"id":.[].data.name}')

        profile=$(curl https://www.reddit.com/user/$i/about.json \
        	| $filter \
        	| jq 'pick(.id, .kind, .data)')
	
	profileName=$(printf '%s' "$profile" | jq .id)

		while [[ $profileName == *null* ]]; do
			echo "REFETCHING =>" $i

                        profile=$(curl https://www.reddit.com/user/$i/about.json \
                        	| jq -s '.[0]+ {"id":.[].data.name}' \
                        	| jq 'pick(.id, .kind, .data)')

                        profileName=$(printf '%s' "$profile" | jq .id)

		done
	echo "PROFILE GOOD => " $i	
	output=($output$profile)

	sleep .2
done

output=$(printf '%s' "$output" | jq -s | jq '. | unique')

jq --argjson profiles "$output" '.user = $profiles' ./dbcopy.json > ./output.json

#cd $INITIAL_WORKING_DIRECTORY