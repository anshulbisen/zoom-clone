const socket = io('/')

const videoGrid = document.getElementById("video-grid")
const myVideo = document.createElement("video")
myVideo.muted = true

if (USER_ID === '123') {
    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    }).then(teacherStream => {
        //Add teachers video to it own UI
        addVideo(myVideo, teacherStream)

        //Send video to students
        socket.on('user-connected', userId => {
            console.log('sending stream to ' + userId)
            sendMyVideoToNewUser(userId, teacherStream)
        })

    })
}

function sendMyVideoToNewUser(userId, teacherStream) {
    console.log('calling ' + userId)
    const call = peer.call(userId, teacherStream)
    call.on('stream', teacherStream => {
        addVideo(myVideo, teacherStream)
    })
}

const peer = new Peer(USER_ID, {
    host: "/",
    port: '4001'
})

peer.on('open', id => {
    socket.emit('join-room', '3', id)
})

peer.on('call', call => {
    call.answer(undefined)
    call.on('stream', stream => {

        if (USER_ID !== '123') {
            console.log('adding video for ' + USER_ID)
            addVideo(myVideo, stream)
        }
    })
})

function addVideo(video, stream) {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoGrid.append(video)

}
