#!/bin/zsh

#INITIAL_WORKING_DIRECTORY=$(pwd)

cd "$(dirname "$0")" # change to this scripts directory for portability relative paths

profilesRetrieved=()
jq -cr '.data.children[].data.author' ./subreddits/MapPorn.json | while read i; do

	filterAddProfileID=(jq -s '.[0]+ {"id":.[].data.name}') # add `id` property to profile object
	filterSortProfileID=(jq 'pick(.id, .kind, .data)') # move `id` property to top of profile object

	# get profile
    profile=$(curl https://www.reddit.com/user/$i/about.json \
        | $filterAddProfileID \
        | $filterSortProfileID)
	
	profileName=$(printf '%s' "$profile" | jq .id)

		# catch any failed profile requests (invalid profileName) and try again until profile valid
		while [[ $profileName == *null* ]]; do
			echo "REFETCHING =>" $i

			# get profile
            profile=$(curl https://www.reddit.com/user/$i/about.json \
            	| $filterAddProfileID \
            	| $filterSortProfileID)

            profileName=$(printf '%s' "$profile" | jq .id)
		done

	echo "PROFILE GOOD => " $i	

	# accumulate valid profile objects
	profilesRetrieved=($profilesRetrieved$profile)

	sleep .2
done

# get current db profiles
profilesCurrent=$(jq '.user[]' ./dbcopy.json | $filterSortProfileID)

# merge retrieved profiles with current profiles
profilesMerged=($profilesRetrieved$profilesCurrent)

# package and remove duplicate profiles
profilesFinal=$(printf '%s' "$profilesMerged" | jq -s | jq '. | unique')

# add processed profiles objects to the database `user` array
# jq --argjson updatedProfiles "$profilesFinal" '.user = $updatedProfiles' ./dbcopy.json > ./dbcopy.json
profilesProcessed=$(jq --argjson updatedProfiles "$profilesFinal" '.user = $updatedProfiles' ./dbcopy.json)
printf '%s' $profilesProcessed > ./dbcopy.json






# cd $INITIAL_WORKING_DIRECTORY