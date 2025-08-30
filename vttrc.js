export function getConfig(cfg) {
    cfg.name = "VTT Parser";
    cfg.version = "0.1";
    cfg.author = "xianfish";
    cfg.parsePlainText = true;
    cfg.fileType = "vtt";
}

export function parseLyric(context) {
    let blocks = parser(context.lyricText);
    context.lyricText = ''
    const timeMap = {}
    const lrcList = []
    for (const block of blocks) {
        const text = '[' + formatTime(block.startTime) + ']' + block.text
        if (timeMap[block.startTime]) {
            lrcList[lrcList.length - 1] = text
        } else {
            lrcList.push(text)
        }
        lrcList.push('[' + formatTime(block.endTime) + ']')
        timeMap[block.endTime] = true
    }
    context.lyricText = lrcList.join("\r\n");

}
function parser(context) {
    function toTimeStamp(timeStr) {
        const time = timeStr.split(":")
        let h = parseInt(time[0]) * 36e5
        let m = parseInt(time[1]) * 60e3
        let [second, mill] = time[2].split(".")
        let s = parseInt(second) * 1000
        return h + m + s + parseInt(mill)
    }
    let blocks = []
    const rows = context.split('\n\n').slice(1)
    for (const row of rows) {
        const lines = row.split('\n').map(str => str.trim())
        let timeLine = lines[1]
        let [start, end] = timeLine.split('-->').map(str => str.trim())
        let text = lines[2]

        const startTime = toTimeStamp(start)
        const endTime = toTimeStamp(end)

        let block = {
            startTime: startTime,
            endTime: endTime,
            text: text
        }
        blocks.push(block)
    }
    return blocks
}


function zpad(n) {
    var s = n.toString();
    return (s.length < 2) ? "0" + s : s;
}

function formatTime(time) {
    var t = Math.abs(time / 1000);
    var m = Math.floor(t / 60);
    t -= m * 60;
    var s = Math.floor(t);
    var ms = t - s;
    var str = zpad(m) + ":" + zpad(s) + "." + zpad(Math.floor(ms * 100));
    return str;
}