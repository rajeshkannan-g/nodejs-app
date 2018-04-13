angular.module('app').controller("PhotoBoothController", ['$rootScope', '$scope', function ($rootScope, $scope) {
    var c = $scope;
    c.disableStart = true;
    c.disableStop = false;
    c.disableSnap = false;
    c.video = document.getElementById('video');
    c.canvas = document.getElementById('canvas');
    c.videoStream = null;
    c.hasPhoto = false;

    c.snapshot = function () {
        c.canvas.width = c.video.videoWidth;
        c.canvas.height = c.video.videoHeight;
        c.canvas.getContext('2d').drawImage(c.video, 0, 0);
        c.hasPhoto = true;
        c.stop();
    };

    c.stop = function () {
        c.disableStop = true;
        c.disableSnap = true;
        if (c.videoStream) {
            if (c.videoStream.stop) 
                c.videoStream.stop();
            else if (c.videoStream.msStop) 
                c.videoStream.msStop();
            c.videoStream.onended = null;
            c.videoStream = null;
        }
        if (c.video) {
            c.video.onerror = null;
            c.video.pause();
            if (c.video.mozSrcObject)
                c.video.mozSrcObject = null;
            c.video.src = "";
        }
        c.disableStart = false;
    };

    c.start = function () {
        if ((typeof window === 'undefined') || (typeof navigator === 'undefined')) 
            alert('This page needs a Web browser with the objects window.* and navigator.*!');
        else if (!(c.video && c.canvas)) 
            alert('HTML context error!');
        else {
            if (navigator.getUserMedia) 
                navigator.getUserMedia({ video: true }, gotStream, noStream);
            else if (navigator.oGetUserMedia) 
                navigator.oGetUserMedia({ video: true }, gotStream, noStream);
            else if (navigator.mozGetUserMedia) 
                navigator.mozGetUserMedia({ video: true }, gotStream, noStream);
            else if (navigator.webkitGetUserMedia) 
                navigator.webkitGetUserMedia({ video: true }, gotStream, noStream);
            else if (navigator.msGetUserMedia) 
                navigator.msGetUserMedia({ video: true, audio: false }, gotStream, noStream);
            else 
                alert('getUserMedia() not available from your Web browser!');
        }
    }

    function gotStream(stream) {
        c.disableStart = true;
        c.videoStream = stream;
        c.video.onerror = function () {
            alert('Video Error');
            if (c.video) stop();
        };
        stream.onended = noStream;
        if (window.webkitURL) 
            c.video.src = window.webkitURL.createObjectURL(stream);
        else if (c.video.mozSrcObject !== undefined) {
            c.video.mozSrcObject = stream;
            c.video.play();
        }
        else if (navigator.mozGetUserMedia) {
            c.video.src = stream;
            c.video.play();
        }
        else if (window.URL) 
            c.video.src = window.URL.createObjectURL(stream);
        else 
            c.video.src = stream;
        c.disableSnap = false;
        c.disableStop = false;
        c.hasPhoto = false;
        $scope.$apply();
    }

    function noStream() {
        alert('Access to camera was denied!');
    }

	$rootScope.$on('$viewContentLoaded', function (event){
		c.start();
 	});
    
}]);