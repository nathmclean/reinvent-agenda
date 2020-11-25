import React, {useState} from 'react';

import data from './data/full.json'

type AgendaItem = {
    id: string
    name: string
    description: string
    type: string
    updatedAt: number
    tags: string
    schedulingData: {
        start: {
            timestamp: number
            timeZoneName: string
            timeZoneOffset: number
        }
        end: {
            timestamp: number
            timeZoneName: string
            timeZoneOffset: number
        }
    }
    presenters: string[]
    hiddenTags: string
}

type sessionColor = {
    name: string
    color: string
}

type langTags = {
    name: string
    tag: string
}

function App() {

    const [timeFilter, setTimeFilter] = useState({day: "All", EarlyHour: "00", LateHour: "23"})
    const [sessionFilter, setSessionFilter] = useState(["All"])
    const [langFilter, setLangFilter] = useState<langTags>({name: "All", tag: ""})
    const [trackFilter, setTrackFilter] = useState(["All"])

    const rawAgenda = data as any
    let agenda = rawAgenda as AgendaItem[];

    const langs: langTags[] = [
        {name: "Korean",  tag:"__korean"},
        {name: "Portuguese",  tag:"__portuguese"},
        {name: "English",  tag:"english"},
        {name: "Chinese",  tag:"__chinese"},
        {name: "Italian",  tag:"__italian"},
        {name: "French",  tag:"__french"},
        {name: "Japanese",  tag:"__japanese"}
    ]

    const sessions: sessionColor[] = [
        {name: "Demo", color: "bg-grey-400"},
        {name: "Dev Chat", color: "bg-red-200"},
        {name: "Executive Summit", color: "bg-yellow-200"},
        {name: "Hands-on Content", color: "bg-green-200"},
        {name: "Keynote", color: "bg-blue-300"},
        {name: "Leadership Session", color: "bg-indigo-300"},
        {name: "Lightning Talk", color: "bg-purple-300"},
        {name: "Play", color: "bg-pink-300"},
        {name: "Session", color: "bg-red-400"},
        {name: "Training and Certification", color: "bg-green-400"},
        {name: "Video on Demand", color: "bg-yellow-400"},
    ]

    const tracks = ["Advertising & Marketing", "Alexa", "Amazon.com", "Analytics", "Application Integration", "Architecture", "Artificial Intelligence & Machine Learning", "Automotive", "Blockchain", "Builders' Library", "Business Apps (including Connect)", "Business Intelligence", "Chinese", "Community", "Compute", "Consumer Packaged Goods", "Containers", "Databases", "DeepRacer", "DevOps", "End User Computing", "Energy", "Enterprise Migration", "Financial Services", "French", "Front-End Web & Mobile Development", "Games GameTech", "Global Partner Summit (GPS)", "Healthcare","Innovation","IoT","Italian","Japanese","Korean","Life Sciences","Management Tools & Governance","Manufacturing","Marketplace","Media & Entertainment","Netflix","Networking & Content Delivery","Open Source","Partner Solutions for Business","Portuguese","Power & Utilities","Public Sector","Quantum Computing","Retail","Robotics","Security Compliance and Identity","Serverless","Spanish","Startup","Storage","Telecommunications","Travel & Hospitality","We Power Tech","Windows",".NET"]

    const session = (tags: string) => {
        const {name, color} = sessionSettings(tags)
        return <div className={`md:w-1/4 lg:w-1/5 w-full p-2 md:mr-2 ${color} justify-center flex flex-col`}>
            {name}
        </div>
    }

    const sessionSettings = (tags: string): sessionColor => {
        const splitTags = tags.split(',')
        let returnSess: sessionColor = {name: "", color: "bg-white"}
        splitTags.forEach((tag) => {
            sessions.forEach((sess) => {
                if (tag.trim() === sess.name.trim()) {
                    returnSess = sess
                }
            })
        })

        return returnSess
    }

    const sessionName = (tags: string): string => {
        let sessName = ""
        const splitTags = tags.split(',')
        splitTags.forEach((tag) => {
            sessions.forEach((sess) => {
                if (tag.trim() === sess.name.trim()) {
                    sessName = sess.name
                }
            })
        })
        return sessName
    }

    const allSessions = (): boolean =>{
        let all = false
        sessionFilter.forEach((session) => {
            if (session === "All") {
                all = true
            }
        })
        return all
    }

    const allTracks = (): boolean =>{
        let all = false
        trackFilter.forEach((track) => {
            if (track === "All") {
                all = true
            }
        })
        return all
    }

    const updateSessionFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value === "All" && event.target.checked) {
            setSessionFilter(["All"])
            return
        }
        if (event.target.checked) {
            let newFilter: string[] = []
            sessionFilter.forEach((filter) => {
                if (filter !== "All") {
                    newFilter.push(filter)
                    newFilter.push(filter)
                }
            })
            newFilter.push(event.target.value)
            setSessionFilter(newFilter)
        } else {
            let newFilter: string[] = []
            sessionFilter.forEach((filter) => {
                if (filter !== event.target.value) {
                    newFilter.push(filter)
                }
            })
            if (newFilter.length === 0) {
                newFilter.push("All")
            }
            setSessionFilter(newFilter)
        }
    }

    const updateTrackFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value === "All" && event.target.checked) {
            setTrackFilter(["All"])
            return
        }
        if (event.target.checked) {
            let newFilter: string[] = []
            trackFilter.forEach((filter) => {
                if (filter !== "All") {
                    newFilter.push(filter)
                    newFilter.push(filter)
                }
            })
            newFilter.push(event.target.value)
            setTrackFilter(newFilter)
        } else {
            let newFilter: string[] = []
            trackFilter.forEach((filter) => {
                if (filter !== event.target.value) {
                    newFilter.push(filter)
                }
            })
            if (newFilter.length === 0) {
                newFilter.push("All")
            }
            setTrackFilter(newFilter)
        }
    }

    const googleCalLink = (item: AgendaItem): string => {
        const start = new Date(item.schedulingData.start.timestamp * 1000).toISOString().replace(/-|:|\.\d\d\d/g,"")
        const end = new Date(item.schedulingData.end.timestamp * 1000).toISOString().replace(/-|:|\.\d\d\d/g,"")
        return `https://calendar.google.com/calendar/u/0/r/eventedit?text=${encodeURI(item.name)}&dates=${start}/${end}&details=${encodeURI(item.description)}&location=https://virtual.awsevents.com/media/${encodeURI(item.id)}`
    }

    return (
    <div className="App">
      <header className="flex bg-green-800 p-4 shadow-lg mt-auto text-white">
        <div className="text-2xl">ReInvent Filter</div>
        <div className="text-xl ml-4 mt-1">Agenda Filter</div>
      </header>
      <main className="m-4 my-8 flex flex-col md:flex-row">
          <div className="flex flex-wrap md:flex-col md:w-1/4">

              {/*Date and Time Filter*/}
              <div className="flex flex-wrap md:flex-col mt-4">
                  <label className="mr-2">Start Day:</label>
                  <div>
                      <select value = {timeFilter.day} onChange={(e) => setTimeFilter({...timeFilter, day: e.target.value})} className="w-4/5, border-2 border-green-800">
                      <option value="All">All</option>
                      <option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="8">8</option><option value="9">9</option><option value="10">10</option><option value="11">11</option><option value="15">15</option><option value="16">16</option><option value="17">17</option><option value="18">18</option>
                  </select> December
                  </div>
                  <label className="mr-2">Earliest Start Hour (GMT):</label>
                  <div>
                      <select value={timeFilter.EarlyHour} onChange={(e) => setTimeFilter({...timeFilter, EarlyHour: e.target.value, LateHour: timeFilter.LateHour < e.target.value ? e.target.value : timeFilter.LateHour})} className="w-4/5, border-2 border-green-800">
                      <option value="00">00</option><option value="01">01</option><option value="02">02</option><option value="03">03</option><option value="04">04</option><option value="05">05</option><option value="06">06</option><option value="07">07</option><option value="08">08</option><option value="09">09</option><option value="10">10</option><option value="11">11</option><option value="12">12</option><option value="13">13</option><option value="14">14</option><option value="15">15</option><option value="16">16</option><option value="17">17</option><option value="18">18</option><option value="19">19</option><option value="19">19</option><option value="20">20</option><option value="21">21</option><option value="22">22</option><option value="23">23</option>
                    </select>
                  </div>
                  <label className="mr-2">Latest Start Hour (GMT):</label>
                  <div>
                      <select value={timeFilter.LateHour} onChange={(e) => setTimeFilter({...timeFilter, LateHour: e.target.value, EarlyHour: timeFilter.EarlyHour > e.target.value ? e.target.value : timeFilter.EarlyHour})} className="w-4/5, border-2 border-green-800">
                      <option value="00">00</option><option value="01">01</option><option value="02">02</option><option value="03">03</option><option value="04">04</option><option value="05">05</option><option value="06">06</option><option value="07">07</option><option value="08">08</option><option value="09">09</option><option value="10">10</option><option value="11">11</option><option value="12">12</option><option value="13">13</option><option value="14">14</option><option value="15">15</option><option value="16">16</option><option value="17">17</option><option value="18">18</option><option value="19">19</option><option value="19">19</option><option value="20">20</option><option value="21">21</option><option value="22">22</option><option value="23">23</option>
                    </select>
                  </div>

              </div>
              {/*Language filter*/}
              <div className="flex flex-wrap md:flex-col mt-4">
                  <label className="mr-2">Languages:</label>
                  <div className="mb-2 mr-2">
                      <div><input onChange={(e) => {setLangFilter({name: "All", tag: ""})}} checked={langFilter.name === "All"} type="radio" id="All" value="All" className="mr-2"/><label>All</label></div>
                  </div>
                  {langs.map((lang) => {

                      return <div key={lang.tag} className="mb-2 mr-2">
                          <input onChange={(e) => {setLangFilter(lang)}} checked={langFilter.name === lang.name} type="radio" id={lang.tag} value={lang.tag} className="mr-2"/>
                          <label>{lang.name}</label>
                      </div>
                  })}
              </div>

              {/*Session Filter*/}
              <div className="flex flex-wrap md:flex-col mt-4">
                  <label className="mr-2">Session Types:</label>
                  <div className="mb-2 mr-2">
                      <div><input onChange={updateSessionFilter} checked={allSessions()} type="checkbox" id="All" value="All" className="mr-2"/><label>All</label></div>
                  </div>
                  {sessions.map((sess) => {
                      let checked = false
                      let all = false
                      sessionFilter.forEach((filter) => {
                          if (filter === "All") {
                              all = true
                          }
                          if (filter === sess.name) {
                              checked = true
                          }
                          if (all) {
                              checked = false
                          }
                      })
                      return <div key={sess.name} className="mb-2 mr-2">
                          <input onChange={updateSessionFilter} checked={checked} type="checkbox" id={sess.name} value={sess.name} className="mr-2"/>
                          <label className={`${sess.color} p-1 shadow rounded`}>{sess.name}</label>
                      </div>
                  })}
              </div>

              {/*Track Filter*/}
              <div className="flex flex-wrap md:flex-col mt-4">
                  <label className="mr-2">Tracks:</label>
                  <div className="mb-2 mr-2">
                      <div><input onChange={updateTrackFilter} checked={allTracks()} type="checkbox" id="All" value="All" className="mr-2"/><label>All</label></div>
                  </div>
                  {tracks.map((track) => {
                      let checked = false
                      let all = false
                      trackFilter.forEach((filter) => {
                          if (filter === "All") {
                              all = true
                          }
                          if (filter === track) {
                              checked = true
                          }
                          if (all) {
                              checked = false
                          }
                      })
                      return <div key={track} className="mb-2 mr-2">
                          <input onChange={updateTrackFilter} checked={checked} type="checkbox" id={track} value={track} className="mr-2"/>
                          <label>{track}</label>
                      </div>
                  })}
              </div>
          </div>

          <div className="md:w-3/4">
              {agenda.map((agendaItem) => {
                  const start = new Date(agendaItem.schedulingData.start.timestamp * 1000)
                  const end = new Date(agendaItem.schedulingData.end.timestamp * 1000)

                  const sessName = sessionName(agendaItem.tags)

                  let tags: string[] = []
                  const splitTags = agendaItem.tags.split(",")
                  splitTags.forEach((tag) => {
                      if (tag.trim() !== sessName) {
                          tags.push(tag)
                      }
                  })

                  if (timeFilter.day !== "All" && timeFilter.day !== `${start.getDate()}`) {
                      return  <div/>
                  }

                  if (parseInt(timeFilter.EarlyHour) > start.getHours() || parseInt(timeFilter.LateHour) < start.getHours()) {
                      return  <div/>
                  }

                  if (langFilter.name !== "All") {
                      let found = false
                      const hiddenTags = agendaItem.hiddenTags.split(",")
                      hiddenTags.forEach((tag) => {
                          if (tag.trim() === langFilter.tag) {
                              found = true
                          }
                      })
                      if (!found) {
                         return <div/>
                      }
                  }

                  let found = false
                  sessionFilter.forEach((filter) => {
                      if (filter === sessName || filter === "All") {
                          found = true
                      }
                  })
                  if (!found) {
                      return <div/>
                  }

                  found = false
                  trackFilter.forEach((filter) => {
                      if (filter === "All") {
                          found = true
                      } else {
                          tags.forEach((tag) => {
                              if (filter === tag) {
                                  found = true
                              }
                          })
                      }
                  })
                  if (!found) {
                      return <div/>
                  }


                  return (
                      <div key={agendaItem.id} className="flex border-green-800 border-2 my-2 shadow-lg flex-col md:flex-row">
                          {session(agendaItem.tags)}
                          <div className="md:w-3/4 lg:w-4/5 md:w-full p-2 my-2 mr-2">
                              <h3 className="text-l font-semibold">{agendaItem.name}</h3>
                              <div className="flex flex-wrap">
                                  {tags.map((tag) => {
                                      return <div key={tag} className="bg-green-200 border-2 border-green-600 p-1 px-2 rounded-xl shadow-lg mr-1">{tag}</div>
                                  })}
                              </div>
                              <span>{start.getDate()}/{start.getMonth() + 1} {start.getHours() < 10 ? '0' : ''}{start.getHours()}:{start.getMinutes() < 10 ? '0' : ''}{start.getMinutes()} - {end.getHours() < 10 ? '0' : ''}{end.getHours()}:{end.getMinutes() < 10 ? '0' : ''}{end.getMinutes()} GMT</span>
                              <p>
                                  {agendaItem.description.replace(/<.*>/g, "")}
                              </p>
                              <div className="flex flex-wrap">
                                  <div className="bg-blue-300 border-2 border-blue-600 p-1 px-2 rounded-xl shadow-lg mr-1">
                                      <a href={googleCalLink(agendaItem)} rel="noreferrer" target="_blank">Add to Google Calendar</a>
                                  </div>
                              </div>
                          </div>
                      </div>
                  )
              })}
          </div>

      </main>
      <footer>

      </footer>
    </div>
  );
}

export default App;