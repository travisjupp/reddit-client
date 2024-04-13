const reduceSubredditPosts = (array) => {
    return array.map(async element => {
        const body = await fetch(`https://www.reddit.com/${element}.json`);
        const response = await body.json();
        if (!response.reason || response.reason !== "private") {
            const filter = await response.data.children.reduce((previous, current) => {
                if (previous.data.ups > current.data.ups) {
                    return previous;
                } else if (previous.data.ups < current.data.ups) {
                    return current;
                } else {
                    return current;
                }
            });
            return filter.data;
        };
    });
}

// Consuming the Promises array this returns
// Promise.all(getsubredditPosts(['r/react','r/home'])).then((value) => {
//   console.log(value)
// })