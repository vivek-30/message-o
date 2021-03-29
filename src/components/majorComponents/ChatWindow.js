import React, { useState, useEffect, useRef } from 'react'
import { socket } from '../../client/Chat'
import Message from '../../client/Message'
import chatTone from '../../../public/chat_tone.mp3'
import { setWallpaper } from '../../client/helperFunctions'

const ChatWindow = () => {

    const [ data, setData ] = useState([])
    const [ user, setUser ] = useState('')
    const [ CSS, setCSS ] = useState({
        backgroundColor: '#c2c2c2', 
        padding: '8px 20px'
    })

    const bottomScrollRef = useRef(null)
    const audioRef = useRef(null)

    useEffect(() => {

        setWallpaper()

        socket.on('myMsg', (newData) => {
            setData(data => [ ...data, newData ])
        })

        socket.on('chat', (newData) => {
            setCSS({
                ...CSS, 
                display: 'none'
            })
            setUser('')
            setData(data => [ ...data, newData ])

            if(audioRef){
                audioRef.current.muted = false
                audioRef.current?.play()
            }
        })

        socket.on('status', (user) => {
            setCSS({
                ...CSS,
                display: 'block'
            })
            setUser(user)
        })
        
    }, [])

    useEffect(() => {
        bottomScrollRef.current?.scrollIntoView({ behaviour: "smooth" })
    }, [data])

    return (
        <div style={{ backgroundColor: '#f2f2f2', marginTop: '0.4rem' }}>
            <div id="chat-window">
                <div id="display">
                    <Message data={data} />
                    <div ref={bottomScrollRef}></div>
                </div>
                <div id="status-bar" className="teal-text text-darken-2" style={CSS} >
                    <em>{user} is typing ...</em>
                </div>
                <audio src={chatTone} ref={audioRef} muted></audio>
            </div>
        </div>
    )
}

export default ChatWindow
