import React from 'react'; 
// import csvToJson from 'convert-csv-to-json'; 
import CSVReader from 'react-csv-reader'; 


class Home extends React.Component {
    constructor() {
        super(); 
        this.state = {
            // igData: {}
            // igData: []
            igImpressions: {}, 
            igReach: {}, 
            selectedAudienceCsv: null, 
            selectedSongsCsv: null, 
            audienceData: [], 
            listeners: null, 
            streams: null
        }
    }

    componentDidMount() {
        // fetching Instagram data
        // first have to use user ID to retrieve facebook business account ID

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
                    const impressionsData = resJson.data[0].values[0]; 
                    const reachData = resJson.data[1].values[0];
                    this.setState({
                        igImpressions: impressionsData, 
                        igReach: reachData
                    })
                    // this.setState({
                    //     igData: data
                    // })
                    // this.setState({
                    //     igData: resJson
                    // })
                })
                .catch((error) => {
                    console.log(error + 'error retrieving impressions/reach data from Instagram')
                });
            })
            .catch((error) => {
                console.log(error + 'error retrieving instagram business account id')
            })
        })
        .catch((error) => {
            console.log(error + "error fetching business account id")
        }); 
    }

    // componentDidUpdate() {
    //     const data = this.state.audienceData; 
    //     let listenerCount = 0; 
    //     let streamCount = 0; 
    //     for (let i = 0; i < data.length; i++) {
    //         listenerCount += data[i][1];
    //         streamCount += data[i][2];
    //     }
    //     console.log(listenerCount); 
    //     console.log(streamCount);
    // }

    audienceOnChange = (event) => {
        event.preventDefault(); 
        const file = event.target.files[0]; 
        this.setState({
          selectedAudienceCsv: file
        });
    }

    handleAudienceSubmit = (event) => {
        event.preventDefault(); 
        const data = this.state.audienceData; 
        let listenerCount = 0; 
        let streamCount = 0; 
        for (let i = 0; i < data.length; i++) {
            listenerCount += parseInt(data[i][1]);
            streamCount += parseInt(data[i][2]);
        };

        this.setState({
            listeners: listenerCount, 
            streams: streamCount
        })

        // const csv = this.state.selectedAudienceCsv; 
        // this.setState({
        //     audienceFile: csv
        // }); 

    }

    render() {
        // console.log(this.state.selectedAudienceCsv);
        console.log(this.state.audienceData)
        return (
            <main>
                <h1>Sonvul</h1>
                {/* <h3>Welcome to Sonvul! Upload CSV files from your Spotify for Artists account to get started</h3> */}
                    <section>
                        <h2>Instagram Data</h2>
                        <h3>Impressions this past week:</h3>
                        <p>{this.state.igImpressions.value}</p>
                        <h3>Reach this past week:</h3>
                        <p>{this.state.igReach.value}</p>
                    </section>
                    <section>
                        <h2>Spotify Data</h2>
                        {/* <form onSubmit={event => this.handleAudienceSubmit(event)}>
                            <label>Upload Audience Csv</label><br/>
                            <input type="file" name="audiencecsv" onChange={this.audienceOnChange} />
                            <button type="submit">Upload</button>
                        </form> */}
                        <CSVReader onFileLoaded={(data) => this.state.audienceData.push(data[1], data[2], data[3], data[4], data[5], data[6], data[7])} />
                        <button onClick={event => this.handleAudienceSubmit(event)}>Upload</button>
                        <h3>Listeners this past week</h3>
                            {
                                this.state.listeners != null
                                ? <p>{this.state.listeners}</p>
                                : null
                            }
                        <h3>Streams this past week</h3>
                            {
                                this.state.streams != null
                                ? <p>{this.state.streams}</p>
                                : null
                            }
                    </section>


            </main>
        )
    }
}

export default Home; 