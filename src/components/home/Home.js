import React from 'react'; 
// import csvToJson from 'convert-csv-to-json'; 
import './Home.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInstagram, faSpotify } from '@fortawesome/free-brands-svg-icons'
// npm install --save @fortawesome/free-brands-svg-icons
//   npm install --save @fortawesome/free-regular-svg-icons


class Home extends React.Component {
    constructor() {
        super(); 
        this.state = {
            artistName: null, 
            igImpressionsWeekly: null, 
            igReachWeekly: null, 
            igImpressionsMonthly: null, 
            igReachMonthly: null,
            igTopCities: [],
            igDemographics: [],
            igNewFollowers: null,
        }
    }

    componentDidMount() {
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
            console.log(resJson)
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
                        igImpressionsWeekly: impressionsData, 
                        igReachWeekly: reachData
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
                        igImpressionsMonthly: impressionsTotal, 
                        igReachMonthly: reachTotal
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
                    })
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
                    console.log(demographicSorted)
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
                        igNewFollowers: totalNewFollowers
                    }); 
                })
                .catch((error) => {
                    console.log(error + 'Error retrieving total new ig followers')
                })
            })
            .catch((error) => {
                console.log(error + 'error retrieving instagram business account id')
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

    handleAudienceSubmit = (event) => {
        event.preventDefault(); 
        console.log(this.state.songData);
        const audienceData = this.state.audienceData; 
        const songData = this.state.songData; 
        // console.log(data)
        let listenerCountWeekly = 0;
        let streamCountWeekly = 0; 

        for (let i = 0; i < 7; i++) {
            listenerCountWeekly += parseInt(audienceData[i][1]);
            streamCountWeekly += parseInt(audienceData[i][2]);
        };

        let listenerCountMonthly = 0; 
        let streamCountMonthly = 0; 
        for (let i = 0; i < audienceData.length; i++) {
            listenerCountMonthly += parseInt(audienceData[i][1]); 
            streamCountMonthly += parseInt(audienceData[i][2]); 
        };

        const totalFollowers = audienceData[0][3]; 
        this.setState({
            listenersWeekly: listenerCountWeekly, 
            listenersMonthly: listenerCountMonthly, 
            streamsWeekly: streamCountWeekly, 
            streamsMonthly: streamCountMonthly, 
            followers: totalFollowers, 
        }); 
    }

    render() {
        console.log(this.state.igImpressionsMonthly)
        return (
            <main>
                <h1>Sonvul</h1>
                <h2>Welcome, {this.state.artistName}</h2>
                    <section id="report">
                        <h3>Based on your data, we recommend...</h3>
                        <div className="report-container">
                            <div className="recommendation">
                                <h4>Promoting these songs</h4>
                                <p>1. "{this.props.songData[0][0]}"</p>
                                <p>2. "{this.props.songData[1][0]}"</p>
                                <p>3. "{this.props.songData[2][0]}"</p>
                                {/* {
                                    this.props.songData.length !== 0
                                    ? this.props.songData.map((song, idx) => {
                                        return <p key={idx}>"{song[0]}" Listeners: {song[1]} Streams: {song[2]}</p>
                                    })
                                    : null
                                } */}
                            </div>
                            <div className="recommendation">
                                <h4>In these cities</h4>
                                {
                                    this.state.igTopCities.map((c, idx) => {
                                        return <p key={idx}>{idx + 1}. {c[0]}</p>
                                    })
                                }
                            </div>
                            <div className="recommendation">
                                <h4>Among these demographics</h4>
                                {
                                    this.state.igDemographics.map((dem, idx) => {
                                        return <p key={idx}>{idx + 1}. {dem[0]}s age {dem[1]}</p>
                                    })
                                }
                            </div>
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
                            ? <p>{this.props.followers}</p>
                            : null
                        }
                        <h4>Top Songs this Month</h4>
                        {
                            this.props.songData.length !== 0
                            ? this.props.songData.map((song, idx) => {
                                return <p key={idx}>"{song[0]}" Listeners: {song[1]} Streams: {song[2]}</p>
                            })
                            : null
                        }
                    </section>
            </main>
        )
    }
}

export default Home; 