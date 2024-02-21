#!/bin/zsh

# Get user profiles from Reddit and load them into json-server DB
# Must have jq installed https://jqlang.github.io/jq/download/

INITIAL_WORKING_DIRECTORY=$(pwd)

cd "$(dirname "$0")" # change to this scripts directory for portability of relative paths

profilesRetrieved=()

jq -r '.data.children[].data.author' ../subreddits/react.json | while read i; do

	filterAddProfileID=(jq -s '.[0]+ {"id":.[].data.name}') # add `id` property to profile object
	filterSortProfileID=(jq 'pick(.id, .kind, .data)') # move `id` property to top of profile object

	# get profile
    profile=$(curl https://www.reddit.com/user/$i/about.json \
        | $filterAddProfileID \
        | $filterSortProfileID)
	
	profileName=$(printf '%s' "$profile" | jq .id)

		# catch any failed profile requests (invalid profileName) and try again until profile valid
		numRetries=2
		while [[ $profileName == *null* && $numRetries != 0 ]]; do
			echo "REFETCHING =>" $i

			# retry get profile
            profile=$(curl https://www.reddit.com/user/$i/about.json \
            	| $filterAddProfileID \
            	| $filterSortProfileID)

            profileName=$(printf '%s' "$profile" | jq .id)
            ((numRetries--))
		done

	if [[ $profileName != *null* ]]; then
		echo "PROFILE GOOD => " $i	

		# accumulate valid profile objects
		profilesRetrieved=($profilesRetrieved$profile)
	else
		echo "PROFILE SKIPPED => " $i
	fi

	sleep .2
done

# get current db profiles
profilesCurrent=$(jq '.user[]' ../dbcopy.json | $filterSortProfileID)

# merge retrieved profiles with current profiles
profilesMerged=($profilesRetrieved$profilesCurrent)

# package (slurp) and remove duplicate profiles
profilesFinal=$(printf '%s' "$profilesMerged" | jq -s 'unique_by(.id)')

# add processed profiles objects to the database `user` array
profilesProcessed=$(jq --argjson updatedProfiles "$profilesFinal" '.user = $updatedProfiles' ../dbcopy.json)
printf '%s' $profilesProcessed > ../dbcopy.json



cd $INITIAL_WORKING_DIRECTORY