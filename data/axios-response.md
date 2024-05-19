# Axios response success

```json

{
    "data": {
        "kind": "t2",
        "data": {
            "is_employee": false,
            "is_friend": false,
            "subreddit": {
                "default_set": true,
                "user_is_contributor": null,
                "banner_img": "",
                "allowed_media_in_comments": [],
                "user_is_banned": null,
                "free_form_reports": true,
                "community_icon": null,
                "show_media": true,
                "icon_color": "#FFD635",
                "user_is_muted": null,
                "display_name": "u_ATF8643",
                "header_img": null,
                "title": "",
                "previous_names": [],
                "over_18": true,
                "icon_size": [
                    256,
                    256
                ],
                "primary_color": "",
                "icon_img": "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_2.png",
                "description": "",
                "submit_link_label": "",
                "header_size": null,
                "restrict_posting": true,
                "restrict_commenting": false,
                "subscribers": 0,
                "submit_text_label": "",
                "is_default_icon": true,
                "link_flair_position": "",
                "display_name_prefixed": "u/ATF8643",
                "key_color": "",
                "name": "t5_4y2cp6",
                "is_default_banner": true,
                "url": "/user/ATF8643/",
                "quarantine": false,
                "banner_size": null,
                "user_is_moderator": null,
                "accept_followers": false,
                "public_description": "",
                "link_flair_enabled": false,
                "disable_contributor_requests": false,
                "subreddit_type": "user",
                "user_is_subscriber": null
            },
            "snoovatar_size": null,
            "awardee_karma": 75,
            "id": "awv1yska",
            "verified": true,
            "is_gold": false,
            "is_mod": false,
            "awarder_karma": 0,
            "has_verified_email": true,
            "icon_img": "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_2.png",
            "hide_from_robots": true,
            "link_karma": 305,
            "is_blocked": false,
            "total_karma": 5539,
            "pref_show_snoovatar": false,
            "name": "ATF8643",
            "created": 1629813828,
            "created_utc": 1629813828,
            "snoovatar_img": "",
            "comment_karma": 5159,
            "accept_followers": false,
            "has_subscribed": true
        }
    },
    "status": 200,
    "statusText": "",
    "headers": {
        "cache-control": "private, s-maxage=0, max-age=0, must-revalidate, no-store",
        "content-length": "700",
        "content-type": "application/json; charset=UTF-8",
        "expires": "-1"
    },
    "config": {
        "transitional": {
            "silentJSONParsing": true,
            "forcedJSONParsing": true,
            "clarifyTimeoutError": false
        },
        "adapter": [
            "xhr",
            "http"
        ],
        "transformRequest": [
            null
        ],
        "transformResponse": [
            null
        ],
        "timeout": 0,
        "xsrfCookieName": "XSRF-TOKEN",
        "xsrfHeaderName": "X-XSRF-TOKEN",
        "maxContentLength": -1,
        "maxBodyLength": -1,
        "env": {},
        "headers": {
            "Accept": "application/json, text/plain, */*"
        },
        "method": "get",
        "url": "https://www.reddit.com/user/ATF8643/about.json"
    },
    "request": {}
}
```

## Axios response error

```json
{
    "message": "Request failed with status code 429",
    "name": "AxiosError",
    "stack": "AxiosError: Request failed with status code 429\n    at settle (http://localhost:3000/static/js/bundle.js:70786:12)\n    at XMLHttpRequest.onloadend (http://localhost:3000/static/js/bundle.js:69446:66)\n    at Axios.request (http://localhost:3000/static/js/bundle.js:69947:41)\n    at async http://localhost:3000/static/js/bundle.js:64369:22\n    at async http://localhost:3000/static/js/bundle.js:67666:27",
    "config": {
        "transitional": {
            "silentJSONParsing": true,
            "forcedJSONParsing": true,
            "clarifyTimeoutError": false
        },
        "adapter": [
            "xhr",
            "http"
        ],
        "transformRequest": [
            null
        ],
        "transformResponse": [
            null
        ],
        "timeout": 0,
        "xsrfCookieName": "XSRF-TOKEN",
        "xsrfHeaderName": "X-XSRF-TOKEN",
        "maxContentLength": -1,
        "maxBodyLength": -1,
        "env": {},
        "headers": {
            "Accept": "application/json, text/plain, */*"
        },
        "method": "get",
        "url": "https://www.reddit.com/user/ATF8643/about.json"
    },
    "code": "ERR_BAD_REQUEST",
    "status": 429
}
```
