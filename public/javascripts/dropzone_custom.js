document.addEventListener("DOMContentLoaded", function(event) {
  // Get the template HTML and remove it from the doumenthe template HTML and remove it from the doument
  var previewNode = document.querySelector(".template");
  previewNode.id = "";
  previewNode.className = "";
  var previewTemplate = previewNode.parentNode.innerHTML;
  previewNode.parentNode.removeChild(previewNode);

  var post_url = document.querySelector('meta[name="upload-url"]').getAttribute('value') || "";

  function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return 'n/a';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    if (i == 0) return bytes + ' ' + sizes[i];
    return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
  }

  function fakeFileUpload(data) {
    var filename = 'browser-upload-' + new Date().toISOString() + '.txt';
    // Define a boundary, I stole this from IE but you can use any string AFAIK
    var boundary = "----FakeFileUploadBoundary1234";
    var xhr = new XMLHttpRequest();
    var body = '--' + boundary + '\r\n' +
             // Parameter name is "file" and local filename is "temp.txt"
             'Content-Disposition: form-data; name="files[]";' +
             'filename="' + filename + '"\r\n' +
             // Add the file's mime-type
             'Content-type: plain/text\r\n\r\n' +
             data + '\r\n' +
             '--' + boundary + '--';

    xhr.open("POST", post_url + "/upload", true);
    xhr.setRequestHeader("Content-type", "multipart/form-data; boundary="+boundary);
    xhr.addEventListener('load', function() {
      var data = JSON.parse(this.responseText);
      var template = document.createElement('div');
      template.innerHTML = previewTemplate;
      template = template.querySelector('.row');
      template.querySelector(".status").classList.add('hidden');
      template.querySelector(".link").classList.remove('hidden');
      if (!data.files || data.files.length <= 0) return;
      var name = document.querySelector('meta[name="site-href"]').getAttribute('value') + data.files[0].url;
      template.querySelector(".link-href").setAttribute('href', name);
      template.querySelector(".link-href").innerHTML = name;
      template.querySelector("span.name").innerHTML = filename;
      template.querySelector("span.size").innerHTML = bytesToSize(data.files[0].size);
      document.querySelector('.container#preview').appendChild(template);
    });
    xhr.send(body);
  }

  var pastebtn = document.querySelector("#paste-button");
  pastebtn.addEventListener("click", function(event) {
    var wrap = document.querySelector("#paste-wrap");
    if (wrap.classList.contains("hidden")) {
      wrap.classList.remove("hidden");
      pastebtn.innerHTML = "x";
    } else {
      wrap.classList.add("hidden");
      pastebtn.innerHTML = "Paste…";
    }
  });
  var submitpastebtn = document.querySelector('button#paste-submit-button');
  submitpastebtn.addEventListener("click", function(event) {
    var content = document.querySelector("textarea#paste-box").value;
    fakeFileUpload(content);
  });

  function errorHandler(file, response) {
    var message = response;
    if (typeof response !== "string") message = response.message;
    file.previewElement.classList.add("dz-error");
    _ref = file.previewElement.querySelectorAll("[data-dz-errormessage]");
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        node = _ref[_i];
        _results.push(node.textContent = message);
    }
    return _results;
  }

  var dz = new Dropzone(document.body, { // Make the whole body a dropzone
    url: post_url + "/upload", // Set the url
    paramName: "files[]",
    thumbnailWidth: 60,
    thumbnailHeight: 60,
    parallelUploads: 20,
    maxFilesize: document.querySelector('meta[name="max-up-size"]').getAttribute('value') / 1000000,
    previewTemplate: previewTemplate,
    dictFileTooBig: "O-o-onii-san noo its too big~ ({{filesize}}MB > {{maxFilesize}}MB)",
    autoQueue: true, // Make sure the files aren't queued until manually added
    previewsContainer: "#preview", // Define the container to display the previews
    clickable: "#upload-button", // Define the element that should be used as click trigger to select files.
    error: errorHandler
  });

  dz.on("addedfile", function(file) {
    file.previewElement.querySelector(".remove").onclick = function() { dz.removeFile(file); };
  });

  dz.on("sending", function(file) {
    // Show the total progress bar when upload starts
    document.querySelector(".file-progress").style.opacity = "1";
  });

  dz.on("complete", function(file) {
    file.previewElement.querySelector(".status").classList.add('hidden');

    if (!file.xhr || !file.xhr.response) return;
    var data = JSON.parse(file.xhr.response);
    if (!data.files || data.files.length <= 0) return;
    file.previewElement.querySelector(".link").classList.remove('hidden');
    var name = document.querySelector('meta[name="site-href"]').getAttribute('value') + "/" + data.files[0].url;
    file.previewElement.querySelector(".link-href").setAttribute('href', name);
    file.previewElement.querySelector(".link-href").innerHTML = name;
  });

  dz.on("uploadprogress", function(file, progress, bytesSent) {
    file.previewElement.querySelector(".file-progress .progress-inner").style.width = progress + "%";
  });

  // Hide the total progress bar when nothing's uploading anymore
  dz.on("queuecomplete", function(progress) {
    //document.querySelector(".file-progress").style.opacity = "0";
  });
});
