import React from 'react'; 
import './Home.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faSpotify, faFacebook, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { famMusic } from '@fortawesome/free-regular-svg-icons'
import { Link } from 'react-scroll';
import { faMusic, faCity, faUsers } from '@fortawesome/free-solid-svg-icons';
// npm install --save @fortawesome/free-brands-svg-icons
// npm install --save @fortawesome/free-regular-svg-icons


class Home extends React.Component {
    constructor() {
        super(); 
        this.state = {
            artistName: null, 
            artistImage: "",
            igImpressionsWeekly: null, 
            igReachWeekly: null, 
            igImpressionsMonthly: null, 
            igReachMonthly: null,
            igTopCities: [],
            igDemographics: [],
            igNewFollowers: null,
            youTubeStats: {}, 
            venueCities: [],
            venuesCity1: [], 
            venuesCity2: [], 
            venuesCity3: [], 
            blogs: [], 
            similarArtists: []
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0); 
        // fetching Instagram data
        // first have to use user access token to retrieve facebook business account ID

        fetch(`https://graph.facebook.com/v11.0/me/accounts?access_token=${this.props.user.accessToken}`, {
            method: 'GET', 
            headers: {
                'content-type': 'application/json'
            }
        })
        .then((res) => {
            if (!res.ok) {
                throw new Error()
            } 
            return res.json()
        })
        .then((resJson) => {
            const fbAccountId = resJson.data[0].id; 
            const token = resJson.data[0].access_token; 
            const name = resJson.data[0].name;
            this.setState({
                artistName: name
            }); 
            // then use facebook account id to get Instagram business acount ID
            fetch(`https://graph.facebook.com/v11.0/${fbAccountId}?fields=instagram_business_account&access_token=${token}`, {
                method: 'GET', 
                headers: {
                    'content-type': 'application/json'
                }
            })
            .then((res) => {
                if(!res.ok) {
                    throw new Error()
                }
                return res.json()
            })
            .then((resJson) => {
                const igAccountId = resJson.instagram_business_account.id; 
                // now can make calls to Instagram api
                // docs: https://developers.facebook.com/docs/instagram-api/reference/ig-user/insights
                // getting impressions and reach data weekly
                fetch(`https://graph.facebook.com/v11.0/${igAccountId}/insights?access_token=${token}&metric=impressions,reach&period=week`, {
                    method: 'GET', 
                    headers: {
                        'content-type': 'application/json'
                    }
                })
                .then((res) => {
                    if(!res.ok) {
                        throw new Error()
                    }
                    return res.json()
                })
                .then((resJson) => {
                    const impressionsData = resJson.data[0].values[0].value; 
                    const reachData = resJson.data[1].values[0].value;
                    this.setState({
                        igImpressionsWeekly: impressionsData.toLocaleString(), 
                        igReachWeekly: reachData.toLocaleString()
                    }); 
                })
                .catch((error) => {
                    console.log(error + 'error retrieving impressions/reach data from Instagram')
                });

                // getting impressions and reach data monthly
                const untilObj = new Date();
                const prevMonth = untilObj.getMonth() - 1; 
                const sinceObj = new Date(untilObj.getFullYear(), prevMonth, untilObj.getDate() + 1); // or .getDate() + 2?
                const until = JSON.stringify(untilObj).replace(/ /g,'').replace(/['"]+/g, ''); 
                const since = JSON.stringify(sinceObj).replace(/ /g,'').replace(/['"]+/g, ''); 
                fetch(`https://graph.facebook.com/v11.0/${igAccountId}/insights?access_token=${token}&metric=impressions,reach&period=days_28&since=${since}&until=${until}`, {                                                                                                                                                                                                                        
                    method: 'GET',
                    headers: {
                        'content-type': 'application/json'
                    }
                })
                .then((res) => {
                    if(!res.ok) {
                        throw new Error()
                    }
                    return res.json()
                })
                .then((resJson) => {
                    // console.log(resJson)
                    const impressionValues = resJson.data[0].values;
                    let impressionsTotal = 0; 
                    for (let i = 0; i < impressionValues.length; i++) {
                        impressionsTotal += impressionValues[i].value
                    }; 

                    const reachValues = resJson.data[1].values;
                    let reachTotal = 0; 
                    for (let i = 0; i < reachValues.length; i++) {
                        reachTotal += reachValues[i].value
                    };     
                    // console.log(impressionsTotal, reachTotal) 
                    this.setState({
                        igImpressionsMonthly: impressionsTotal.toLocaleString(), 
                        igReachMonthly: reachTotal.toLocaleString()
                    })  
                })
                .catch((error) => {
                    console.log(error + 'error retrieving monthly reach and impressions data')
                }); 

                // getting top user cities
                fetch(`https://graph.facebook.com/v11.0/${igAccountId}/insights?access_token=${token}&metric=audience_city&period=lifetime`, {
                    method: 'GET', 
                    headers: {
                        'content-type': 'application/json'
                    }
                })
                .then((res) => {
                    if (!res.ok) {
                        throw new Error()
                    }
                    return res.json()
                })
                .then((resJson) => {
                    const citiesObj = resJson.data[0].values[0].value; 
                    const citiesArr = Object.entries(citiesObj); 
                    const sortedArr = citiesArr.sort((a, b) => a[1] - b[1]); 
                    const topCities = []; 
                    for (let i = sortedArr.length - 1; i > sortedArr.length - 6; i--) {
                        topCities.push(sortedArr[i])
                    }; 
                    return topCities
                })
                .then((cities) => {
                    this.setState({
                        igTopCities: cities
                    });
                    this.setState({
                        venueCities: [cities[0][0], cities[1][0], cities[2][0]]
                    });                      

                    // get venues based on top user cities?
                    // retrieving venues from yelp API
                    fetch(`http://localhost:8000/api/yelp-venues/${cities[0][0]}`, {
                        method: 'GET', 
                        headers: {
                            'content-type': 'application/json'
                        }
                    })
                    .then((res) => {
                        if (!res.ok) {
                            throw new Error()
                        }
                        return res.json()
                    })
                    .then((resJson) => {
                        this.setState({
                            venuesCity1: resJson.businesses
                        })
                    })
                    .then(() => {
                        // retrieving venues for city #2
                        fetch(`http://localhost:8000/api/yelp-venues/${cities[1][0]}`, {
                            method: 'GET', 
                            headers: {
                                'content-type': 'application/json'
                            }
                        })
                        .then((res) => {
                            if (!res.ok) {
                                throw new Error()
                            }
                            return res.json()
                        })
                        .then((resJson) => {
                            this.setState({
                                venuesCity2: resJson.businesses
                            })
                        })
                        .then(() => {
                            // retrieving venues for city #3
                            fetch(`http://localhost:8000/api/yelp-venues/${cities[2][0]}`, {
                                method: 'GET', 
                                headers: {
                                    'content-type': 'application/json'
                                }
                            })
                            .then((res) => {
                                if (!res.ok) {
                                    throw new Error()
                                }
                                return res.json()
                            })
                            .then((resJson) => {
                                this.setState({
                                    venuesCity3: resJson.businesses
                                })
                            })
                            .catch((error) => {
                                console.log(error + 'error retrieving third city venues from Yelp API')
                            })
                        })
                        .catch((error) => {
                            console.log(error + 'error retrieving second city venues from Yelp API')
                        })
                    })
                    .catch((error) => {
                        console.log(error + 'error retrieving first city venues from Yelp API')
                    }); 

                })
                .catch((error) => {
                    console.log(error + 'error retrieving top ig user cities')
                }); 

                // getting top user demographics
                fetch(`https://graph.facebook.com/v11.0/${igAccountId}/insights?access_token=${token}&metric=audience_gender_age&period=lifetime`, {
                    method: 'GET', 
                    headers: {
                        'content-type': 'application/json'
                    }
                })
                .then((res) => {
                    if (!res.ok) {
                        throw new Error()
                    }
                    return res.json()
                })
                .then((resJson) => {
                    const demographicInfo = resJson.data[0].values[0].value; 
                    const demographicArr = Object.entries(demographicInfo); 
                    const demographicSorted = demographicArr.sort((a, b) => a[1] - b[1]); 
                    const topDemographics = []; 
                    for (let i = demographicSorted.length - 1; i > demographicSorted.length - 6; i--) {
                        if (demographicSorted[i][0].split('.')[0] === 'M') {
                            const dem = [demographicSorted[i][0].split('.')[0] + "ale", demographicSorted[i][0].split('.')[1], demographicSorted[i][1]]; 
                            topDemographics.push(dem)
                        } else if (demographicSorted[i][0].split('.')[0] === 'F') {
                            const dem = [demographicSorted[i][0].split('.')[0] + "emale", demographicSorted[i][0].split('.')[1], demographicSorted[i][1]]; 
                            topDemographics.push(dem)
                        }

                        // topDemographics.push(demographicSorted[i])
                    }; 

                    this.setState({
                        igDemographics: topDemographics
                    }); 
                })
                .catch((error) => {
                    console.log(error + 'Error retrieving ig demographics')
                })

                // getting total new followers for the current month
                fetch(`https://graph.facebook.com/v11.0/${igAccountId}/insights?access_token=${token}&metric=follower_count&period=day&since=${since}&until=${until}`, {
                    method: 'GET', 
                    headers: {
                        'content-type': 'application/json'
                    }
                })
                .then((res) => {
                    if (!res.ok) {
                        throw new Error()
                    }
                    return res.json()
                })
                .then((resJson) => {
                    const followerData = resJson.data[0].values
                    let totalNewFollowers = 0; 
                    for (let i = 0; i < followerData.length; i++) {
                        totalNewFollowers += followerData[i].value
                    }; 
                    this.setState({
                        igNewFollowers: totalNewFollowers.toLocaleString()
                    }); 
                })
                .catch((error) => {
                    console.log(error + 'Error retrieving total new ig followers')
                })
            })
            .catch((error) => {
                console.log(error + 'error retrieving instagram business account id')
            })

            // use artist name to get Youtube channel ID
            fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${name}&type=channel&key=${process.env.REACT_APP_API_KEY_GOOGLE}`, {
                method: 'GET', 
                headers: {
                    'content-type':'application/json'
                }
            })
            .then((res) => {
                if (!res.ok) {
                    throw new Error()
                }
                return res.json()
            })
            .then((resJson) => {
                // console.log(resJson.items[0].id.channelId)
                const channelId = resJson.items[0].id.channelId
                // now use channelId to retrieve channel metrics/stats
                fetch(`https://youtube.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${process.env.REACT_APP_API_KEY_GOOGLE}`, {
                    method: 'GET', 
                    headers: {
                        'content-type': 'application/json'
                    }
                })
                .then((res) => {
                    if (!res.ok) {
                        throw new Error()
                    }
                    return res.json()
                })
                .then((resJson) => {
                    const stats = resJson.items[0].statistics; 
                    this.setState({
                        youTubeStats: stats
                    }); 
                })
                .catch((error) => {
                    console.log(error + 'Error retrieving youtube channel stats')
                })
            })
            .catch((error) => {
                console.log(error + 'Error retrieving Youtube channel ID')
            })
        })
        .then(() => {
            // retrieving music blogs via serp API
            fetch('http://localhost:8000/api/music-blogs', {
                method: 'GET', 
                headers: {
                    'content-type': 'application/json'
                }
            })
            .then((res) => {
                if (!res.ok) {
                    throw new Error()
                }
                return res.json()
            })
            .then((resJson) => {
                console.log(resJson)
                this.setState({
                    blogs: resJson
                })
            })
            .catch((error) => {
                console.log(error)
            })

        })
        .then(() => {
            // getting artist image from spotify
            fetch('http://localhost:8000/api/spotify', {
                method: 'GET', 
                headers: {
                    'content-type': 'application/json'
                }
            })
            .then((res) => {
                if (!res.ok) {
                    throw new Error()
                }
                return res.json()
            })
            .then((resJson) => {
                console.log(resJson)
                this.setState({
                    artistImage: resJson.images[0].url
                })
            })
            .catch((error) => {
                console.log(error)
            })
        })
        .then(() => {
            // getting similar artists to network with from Spotify
            fetch('http://localhost:8000/api/spotify/related-artists', {
                method: 'GET', 
                headers: {
                    'content-type': 'application/json'
                }
            })
            .then((res) => {
                if (!res.ok) {
                    throw new Error()
                }
                return res.json()
            })
            .then((resJson) => {
                // console.log(resJson)
                this.setState({
                    similarArtists: resJson.artists
                })
            })
            .catch((error) => {
                console.log(error)
            })
        })
        .catch((error) => {
            console.log(error + "error fetching business account id")
        });
    }

    audienceOnChange = (event) => {
        event.preventDefault(); 
        const file = event.target.files[0]; 
        this.setState({
          selectedAudienceCsv: file
        });
    }

    render() {
        console.log(this.state.blogs);
        return (
            <main>
                <h1>Sonvul</h1>
                <img src={this.state.artistImage} height="200" width="200" />
                <h2>Welcome, {this.state.artistName}</h2>
                    <nav>
                        <ul>
                            <li><Link to="report" smooth={true} duration={1000}>Your Report</Link></li>
                            <li><Link to="instagram" smooth={true} duration={1000}>Instagram Data</Link></li>
                            <li><Link to="spotify" smooth={true} duration={1000}>Spotify Data</Link></li>
                            <li><Link to="youtube" smooth={true} duration={1000}>YouTube Data</Link></li>
                            <li><Link to="resources" smooth={true} duration={1000}>Additional Resources</Link></li>
                        </ul>
                    </nav>
                    <section id="report">
                        <h3>Based on your data, we recommend...</h3>
                        <div className="report-container">
                            <div className="recommendation">
                                <div className="recommendation-info">
                                    <FontAwesomeIcon icon={faMusic} />
                                    <h4>Promoting these songs</h4>
                                    <p>1. "{this.props.songData[0][0]}"</p>
                                    <p>2. "{this.props.songData[1][0]}"</p>
                                    <p>3. "{this.props.songData[2][0]}"</p>
                                    <p style={{visibility: "hidden"}}>4.</p>
                                    <p style={{visibility: "hidden"}}>5.</p>
                                    {/* {
                                        this.props.songData.length !== 0
                                        ? this.props.songData.map((song, idx) => {
                                            return <p key={idx}>"{song[0]}" Listeners: {song[1]} Streams: {song[2]}</p>
                                        })
                                        : null
                                    } */}
                                </div>
                                <h4>Using Spotify Ads:</h4>
                                <a href="https://ads.spotify.com/en-US/music-marketing/" target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faSpotify} /></a>
                            </div>
                            <div className="recommendation">
                                <div className="recommendation-info">
                                    <FontAwesomeIcon icon={faCity} />

                                    <h4>In these cities</h4>
                                    {
                                        this.state.igTopCities.map((c, idx) => {
                                            return <p key={idx}>{idx + 1}. {c[0]}</p>
                                        })
                                    }
                                </div>
                                <h4>Using Instagram Ads:</h4>
                                <a href="https://business.instagram.com/advertising" target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faInstagram} /></a>
                            </div>
                            <div className="recommendation">
                                <div className="recommendation-info">
                                    <FontAwesomeIcon icon={faUsers} />
                                    <h4>Among these demographics</h4>
                                    {
                                        this.state.igDemographics.map((dem, idx) => {
                                            return <p key={idx}>{idx + 1}. {dem[0]}s age {dem[1]}</p>
                                        })
                                    }
                                </div>
                                <h4>Using Instagram Ads:</h4>
                                <a href="https://business.instagram.com/advertising" target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faInstagram} /></a>
                            </div>
                        </div>
                        <h3>Performing at these venues</h3>
                        <div className="venue-container">
                            <div className="venues">
                                <h4>{this.state.venueCities[0]}</h4>
                                <div className="venues-list">
                                {
                                    this.state.venuesCity1.map((venue, idx) => {
                                        return <div key={idx} className="venue">
                                            
                                            <img src={venue.image_url} height="50" width="50" />
                                            <div className="venue-info">
                                                <h5>{venue.name}</h5>
                                                <p>{venue.display_phone ? venue.display_phone : "No number available"}</p>
                                            </div>
                                        </div>
                                    })
                                }
                                </div>
                            </div>
                            <div className="venues">
                                <h4>{this.state.venueCities[1]}</h4>
                                <div className="venues-list">
                                {
                                    this.state.venuesCity2.map((venue, idx) => {
                                        return <div key={idx} className="venue">
                                            <img src={venue.image_url} height="50" width="50" />
                                            <div className="venue-info">
                                                <h5>{venue.name}</h5>
                                                <p>{venue.display_phone ? venue.display_phone : "No number available"}</p>
                                            </div>
                                        </div>
                                    })
                                }
                                </div>
                            </div>
                            <div className="venues">
                                <h4>{this.state.venueCities[2]}</h4>
                                <div className="venues-list">
                                {
                                    this.state.venuesCity3.map((venue, idx) => {
                                        return <div key={idx} className="venue">
                                            <img src={venue.image_url} height="50" width="50" />
                                            <div className="venue-info">
                                                <h5>{venue.name}</h5>
                                                <p>{venue.display_phone ? venue.display_phone : "No number available"}</p>
                                            </div>
                                        </div>
                                    })
                                }
                                </div>
                            </div>
                                {/* <iframe
                                    title="venues"
                                    src={`https://www.google.com/maps/embed/v1/search?key=${process.env.REACT_APP_API_KEY_GOOGLE}&q=top+five+concert+venues+in+${this.state.igTopCities[0]}`} allowFullScreen>
                                </iframe>  
                                <iframe
                                    title="venues"
                                    src={`https://www.google.com/maps/embed/v1/search?key=${process.env.REACT_APP_API_KEY_GOOGLE}&q=top+five+concert+venues+in+${this.state.igTopCities[1]}`} allowFullScreen>
                                </iframe>  
                                <iframe
                                    title="venues"
                                    src={`https://www.google.com/maps/embed/v1/search?key=${process.env.REACT_APP_API_KEY_GOOGLE}&q=top+five+concert+venues+in+${this.state.igTopCities[2]}`} allowFullScreen>
                                </iframe>   */}
                        </div>
                        <h3>Sending your music to these blogs</h3>
                        <div className="blogs-container">
                            {
                                this.state.blogs.map((blog, idx) => {
                                    return <div key={idx} className="blog">
                                        {/* <h4> {idx + 1}. {blog.title}</h4> */}
                                        <h4>{blog.name}</h4>
                                        <a href={blog.link} target="_blank"><img src={blog.image} /></a>
                                        {/* <a href={blog.link}>{blog.link}</a> */}
                                    </div>
                                })
                            }
                        </div>
                        <h3>And networking with these artists</h3>
                        <div className="similar-artists-container">
                            {
                                this.state.similarArtists.map((artist, idx) => {
                                    return <div key={idx} className="similar-artist">
                                        <a href={artist.external_urls.spotify} target="_blank"><img src={artist.images[0].url} height="50" width="50" /></a>
                                        <h4>{artist.name}</h4>
                                    </div>
                                })
                            }
                        </div>
                    </section>
                    <section id="instagram">
                        {/* <h2>Welcome, {this.state.artistName}</h2> */}
                        <h3><FontAwesomeIcon icon={faInstagram}/> Instagram Data</h3>
                        <h4>New followers this month:</h4>
                        {
                            this.props.igNewFollowers !== null
                            ? <p>{this.state.igNewFollowers}</p>
                            : null
                        }
                        <div className="ig-container1">
                            <div className="impressions-container">
                                <h4>Impressions this past week</h4>
                                {
                                    this.props.igImpressionsWeekly !== null
                                    ? <p> {this.state.igImpressionsWeekly}</p>
                                    : null
                                }
                                <h4>Impressions this past month</h4>
                                {
                                    this.props.igImpressionsMonthly !== null
                                    ? <p> {this.state.igImpressionsMonthly}</p>
                                    : null
                                }
                            </div>
                            <div className="reach-container">
                                <h4>Reach this past week</h4>
                                {
                                    this.props.igReachWeekly !== null
                                    ? <p>{this.state.igReachWeekly}</p>
                                    : null
                                }
                                <h4>Reach this past month</h4>
                                {
                                    this.props.igReachMonthly !== null
                                    ? <p>{this.state.igReachMonthly}</p>
                                    : null
                                }
                            </div>
                        </div>
                        <div className="ig-container2">
                            <div className="cities-container">
                                <h4>Top Cities</h4>
                                {
                                    this.state.igTopCities.map((c, idx) => {
                                        return <p key={idx}>{c[0]} ({c[1]})</p>
                                    })
                                }
                            </div>
                            <div className="demographics-container">
                                <h4>Top User Demographics</h4>
                                {
                                    this.state.igDemographics.length !== 0
                                    ? this.state.igDemographics.map((dem, idx) => {
                                        return <p key={idx}>{dem[0]}s age {dem[1]} ({dem[2]})</p>
                                    })
                                    : null
                                }
                            </div>
                        </div>
                    </section>
                    <section id="spotify">
                        <h3> <FontAwesomeIcon icon={faSpotify} /> Spotify Data</h3>
                        <div className="spotify-container1">
                            <div className="listeners">
                                <h4>Listeners this past week</h4>
                                {
                                    this.props.listenersWeekly !== null
                                    ? <p>{this.props.listenersWeekly}</p>
                                    : null
                                }
                                <h4>Listeners this past month</h4>
                                {
                                    this.props.listenersMonthly !== null
                                    ? <p>{this.props.listenersMonthly}</p>
                                    : null
                                }
                            </div>
                            <div className="streams">
                                <h4>Streams this past week</h4>
                                {
                                    this.props.streamsWeekly !== null
                                    ? <p>{this.props.streamsWeekly}</p>
                                    : null
                                }
                                <h4>Streams this past month</h4>
                                {
                                    this.props.streamsMonthly !== null
                                    ? <p>{this.props.streamsMonthly}</p>
                                    : null
                                }
                            </div>
                        </div>
                        <h4>Total Followers</h4>
                        {
                            this.props.followers !== null
                            ? <p>{parseInt(this.props.followers).toLocaleString()}</p>
                            : null
                        }
                        <h4>Top Songs this Month</h4>
                        {
                            this.props.songData.length !== 0
                            ? this.props.songData.map((song, idx) => {
                                return <p key={idx}>"{song[0]}" Listeners: {parseInt(song[1]).toLocaleString()} Streams: {parseInt(song[2]).toLocaleString()}</p>
                            })
                            : null
                        }
                    </section>
                    <section id="youtube">
                        <h3> <FontAwesomeIcon icon={faYoutube} /> YouTube Data</h3>
                        <div className="youtube-container">
                            <div className="youtube-stat">
                                <h4>Total Subscribers</h4>
                                <p>{parseInt(this.state.youTubeStats.subscriberCount).toLocaleString()}</p>
                            </div>
                            <div className="youtube-stat">
                                <h4>Total Videos</h4>
                                <p>{parseInt(this.state.youTubeStats.videoCount).toLocaleString()}</p>
                            </div>
                            <div className="youtube-stat">
                                <h4>Total Video Views</h4>
                                <p>{parseInt(this.state.youTubeStats.viewCount).toLocaleString()}</p>
                            </div>
                        </div>
                    </section>
                    <section id="resources">
                        <h3>Additional Resources</h3>
                        <h4>Learn how to advertise on...</h4>
                        <div className="resource">
                            <a href="https://business.instagram.com/advertising" target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faInstagram} /><h5>Instagram</h5></a>
                        </div>
                        <div className="resource">
                            <a href="https://www.facebook.com/business/ads" target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faFacebook}/><h5>Facebook</h5></a>
                        </div>
                        <div className="resource">
                            <a href="https://ads.spotify.com/en-US/music-marketing/" target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faSpotify} /><h5>Spotify</h5></a>
                        </div>
                        <div className="resource">
                            <a href="https://www.youtube.com/ads/" target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faYoutube} /><h5>Youtube</h5></a>
                        </div>
                    </section>
            </main>
        )
    }
}

export default Home; 