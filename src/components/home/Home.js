import React from 'react'; 
// import csvToJson from 'convert-csv-to-json'; 
import CSVReader from 'react-csv-reader'; 
import './Home.css'; 


class Home extends React.Component {
    constructor() {
        super(); 
        this.state = {
            igImpressionsWeekly: null, 
            igReachWeekly: null, 
            igImpressionsMonthly: null, 
            igReachMonthly: null,
            igTopCities: [],
            igDemographics: [],
            igNewFollowers: null,
            audienceData: [], 
            songData: [],
            listenersWeekly: null, 
            listenersMonthly: null,
            streamsWeekly: null, 
            streamsMonthly: null, 
            followers: null, 
            topSongs: []
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
            // console.log(resJson)
            const fbAccountId = resJson.data[0].id; 
            const token = resJson.data[0].access_token; 
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
                    for (let i = demographicSorted.length - 1; i > demographicSorted.length - 6; i--) {
                        topDemographics.push(demographicSorted[i])
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
        return (
            <main>
                <h1>Sonvul</h1>
                    <section id="instagram">
                        <h2>Instagram Data</h2>
                        <div className="container1">
                            <div className="impressions-container">
                                <h3>Impressions this past week</h3>
                                {
                                    this.state.igImpressionsWeekly !== null
                                    ? <span> {this.state.igImpressionsWeekly}</span>
                                    : null
                                }
                                <h3>Impressions this past month</h3>
                                {
                                    this.state.igImpressionsMonthly !== null
                                    ? <span> {this.state.igImpressionsMonthly}</span>
                                    : null
                                }
                            </div>
                            <div className="reach-container">
                                <h3>Reach this past week</h3>
                                {
                                    this.state.igReachWeekly !== null
                                    ? <p>{this.state.igReachWeekly}</p>
                                    : null
                                }
                                <h3>Reach this past month</h3>
                                {
                                    this.state.igReachMonthly !== null
                                    ? <p>{this.state.igReachMonthly}</p>
                                    : null
                                }
                            </div>
                        </div>
                        <div className="container2">
                            <div className="cities-container">
                                <h3>Top Cities</h3>
                                {
                                    this.state.igTopCities.map((c, idx) => {
                                        return <p key={idx}>{c[0]} {c[1]}</p>
                                    })
                                }
                            </div>
                            <div className="demographics-container">
                                <h3>Top User Demographics</h3>
                                {
                                    this.state.igDemographics.length !== 0
                                    ? this.state.igDemographics.map((dem, idx) => {
                                        return <p key={idx}>{dem[0]}: {dem[1]}</p>
                                    })
                                    : null
                                }
                            </div>
                        </div>
                        <h3>New followers this month:</h3>
                        {
                            this.state.igNewFollowers !== null
                            ? <p>{this.state.igNewFollowers}</p>
                            : null
                        }
                    </section>
                    <section id="spotify">
                        <h2>Spotify Data</h2>
                        <h4>Upload Audience Data</h4>
                        <CSVReader onFileLoaded={(data) => this.state.audienceData.push(data[1], data[2], data[3], data[4], data[5], data[6], data[7], data[8], data[9], data[10], data[11], data[12], data[13], data[14], data[15], data[16], data[17], data[18], data[19], data[20], data[21], data[22], data[23], data[24], data[25], data[26], data[27], data[28], data[29], data[30])} />
                        <h4>Upload Song Data</h4>
                        <CSVReader onFileLoaded={(data) => this.state.songData.push(data[1], data[2], data[3], data[4], data[5])} />
                        <button onClick={event => this.handleAudienceSubmit(event)}>Upload</button>
                        <div className="container3">
                            <div className="listeners">
                                <h3>Listeners this past week</h3>
                                {
                                    this.state.listenersWeekly !== null
                                    ? <p>{this.state.listenersWeekly}</p>
                                    : null
                                }
                                <h3>Listeners this past month</h3>
                                {
                                    this.state.listenersMonthly !== null
                                    ? <p>{this.state.listenersMonthly}</p>
                                    : null
                                }
                            </div>
                            <div className="streams">
                                <h3>Streams this past week</h3>
                                {
                                    this.state.streamsWeekly !== null
                                    ? <p>{this.state.streamsWeekly}</p>
                                    : null
                                }
                                <h3>Streams this past month</h3>
                                {
                                    this.state.streamsMonthly !== null
                                    ? <p>{this.state.streamsMonthly}</p>
                                    : null
                                }
                            </div>
                        </div>
                        <h3>Total Followers</h3>
                        {
                            this.state.followers !== null
                            ? <p>{this.state.followers}</p>
                            : null
                        }
                        <h3>Top Songs this Month</h3>
                        {
                            this.state.songData.length !== 0
                            ? this.state.songData.map((song, idx) => {
                                return <p key={idx}>{song[0]} Listeners: {song[1]} Streams: {song[2]}</p>
                            })
                            : null
                        }
                    </section>
            </main>
        )
    }
}

export default Home; 