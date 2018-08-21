JSXHelper.PPRO =
JSXHelper.ppro =
JSXHelper.premiere =  
(function () {
    'use strict';

	function test () { alert("JSXHelper.premiere.test"); }

    //---------------------------------------------
    //CLIPS
    //---------------------------------------------
    function copyClipToClip(clip1,clip2) {
        if (!clip1 || !clip2) return;
        clip2.projectItem = clip1.projectItem;
        clip2.inPoint = clip1.inPoint;
        clip2.outPoint = clip1.outPoint;
        clip2.start = clip1.start;
        clip2.end = clip1.end;
    }

    function getClipDuration(clip) {
        return clip.duration;
    }

    function setClipItem(clip,item) {
        var duration = getProjectItemDuration(item);
        clip.projectItem = item;
        clip.end = duration;
        clip.outPoint = clip.inPoint.seconds + duration.seconds;
    }

    function setClipStartTime(clip,sec) {
        clip.start = sec;
        clip.end = clip.projectItem.getOutPoint().seconds + sec;
    }

    //---------------------------------------------
    //PROJECT ITEMS
    //---------------------------------------------

    function getProjectItem(name,type,bin,notRecursive) {
    
        bin = binOrDefault(bin);
        var type_num = null;
        switch(type) {
            case null:
            case undefined:
                type_num = null; 
                break;
            case 2 : 
            case "folder" : 
                type_num = 2; 
                break;
            default : 
                type_num = 1; 
                break;   
        }

        var n = bin.children.numItems;
        var item = null;
        for (var i=0;i<n;i++) {
            item = bin.children[i];
            
            if  (
                (item.name == name)
                &&
                (item.type==type_num || type_num == null)
                )   
                return item;
        
            if (item.type == 2 && !notRecursive) {
                var res = getProjectItem(name,type,item);
                if (res !=null) return res;
            }
        
        }
        return null;
    }

    function getProjectItemDuration(item) {
        var inp = item.getInPoint();
        var outp = item.getOutPoint();
        var time = new Time();
        time.seconds = outp.seconds - inp.seconds;
        return time;
    }



    //---------------------------------------------
    //BIN
    //---------------------------------------------
    function binOrDefault(bin) {
        if (bin) return bin;
        return app.project.rootItem;
    }
    //---------------------------------------------
    //SEQUENCES
    //---------------------------------------------

    function cloneSequence(seq,name,bin) {
        seq = sequenceOrDefault(seq);
        bin = binOrDefault(bin);
        seq.clone();
        var seq_backup = app.project.activeSequence;
        if(name) seq_backup.name = name;
        var seq_backup_item = getProjectItem(seq_backup.name,"sequence");
        seq_backup_item.moveBin(bin);
    }

    function getSequences() {
        var sequences = [];
        sequences.names = [];
        sequences.numItems = 0;
        var i,n,seq;
        n =  app.project.sequences.numSequences;
        sequences.numItems = n;
        for (i=0;i<n;i++) {
            seq = app.project.sequences[i];
            sequences[seq.name] = seq;
            sequences[i] = seq;
            sequences.names[i] = seq.name;
        }
        return sequences;
    }

    function getSequenceByName(name) {
        var n = app.project.sequences.numSequences;
        var item;
        for (var i=0;i<n;i++) {
            item = app.project.sequences[i];
            if (item.name == name) return item;
        }
        return item;
    }

    function sequenceOrDefault(seq) {
        if (seq) return seq;
        return app.project.activeSequence;
    }

    //---------------------------------------------
    //TRACKS
    //---------------------------------------------
    function getTracks(seq) {
        if (!seq) seq = app.project.activeSequence;
        if (!seq) return null;

        var tracks = {};
        tracks.video = [];
        tracks.video.names = [];
        tracks.video.numItems = 0;
        tracks.audio = [];
        tracks.audio.names = [];
        tracks.audio.numItems = 0;

        var i,n,t;
        n =  seq.videoTracks.numTracks;
        tracks.video.numItems = n;
        for (i=0;i<n;i++) {
            t = seq.videoTracks[i];
            tracks.video[t.name] = t;
            tracks.video[i] = t;
            tracks.video.names[i] = t.name;
        }

        n =  seq.audioTracks.numTracks;
        tracks.audio.numItems = n;
        for (i=0;i<n;i++) {
            t = seq.audioTracks[i];
            tracks.audio[t.name] = t;
            tracks.audio[i] = t;
            tracks.audio.names[i] = t.name;
        }
       
        return tracks;
    }

    function getTrackDuration(track) {
        var time = new Time();
        var clips = track.clips;
        n = clips.numItems;
        if (n == 0) return time;
        time.seconds =  clips[n-1].start.seconds + clips[n-1].duration.seconds;
        return time;
    }

    //---------------------------------------------
    //TODO
    //---------------------------------------------
    function copyAVTrackToAVTrack() {}
    function copyTrackToTrack(track1,track2) {}




	/*#####################################################
	RETURNS
	#####################################################*/
    return ( 
        {
            //CLIPS
            copyClipToClip : copyClipToClip,
            getClipDuration : getClipDuration,
            setClipItem : setClipItem,
            setClipStartTime : setClipStartTime,
            //PROJECT ITEMS
            getProjectItem : getProjectItem,
            getProjectItemDuration : getProjectItemDuration,
            //BINS
            binOrDefault : binOrDefault,
            //SEQUENCES
            cloneSequence : cloneSequence,
            getSequences : getSequences,
            getSequenceByName : getSequenceByName,
            sequenceOrDefault : sequenceOrDefault,
            //TRACKS
            getTracks : getTracks,
            getTrackDuration : getTrackDuration,
            //OTHERS
            test : test
        }
    );
	/*#####################################################
												END RETURNS
	#####################################################*/
    
}());


