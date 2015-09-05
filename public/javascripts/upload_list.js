document.addEventListener("DOMContentLoaded", function(event) {
  // Get the template HTML and remove it from the doumenthe template HTML and remove it from the doument
  var previewNode = document.querySelector(".template");
  previewNode.id = "";
  var previewTemplate = previewNode.parentNode.innerHTML;
  previewNode.parentNode.removeChild(previewNode);

  var dz = new Dropzone(document.body, { // Make the whole body a dropzone
    url: "/upload", // Set the url
    thumbnailWidth: 60,
    thumbnailHeight: 60,
    parallelUploads: 20,
    maxFilesize: document.querySelector('meta[name="max-up-size"]').getAttribute('value') / 1000000,
    previewTemplate: previewTemplate,
    autoQueue: true, // Make sure the files aren't queued until manually added
    previewsContainer: "#preview", // Define the container to display the previews
    clickable: "#upload-button" // Define the element that should be used as click trigger to select files.
  });

  dz.on("addedfile", function(file) {
    document.querySelector(".start").classList.remove('hidden');
    document.querySelector(".cancel").classList.remove('hidden');

    file.previewElement.querySelector(".remove").onclick = function() { dz.removeFile(file); };
  });

  dz.on("sending", function(file) {
    // Show the total progress bar when upload starts
    document.querySelector(".file-progress").style.opacity = "1";
  });

  dz.on("complete", function(file) {
    file.previewElement.querySelector(".status").classList.add('hidden');
    file.previewElement.querySelector(".link").classList.remove('hidden');

    var data = JSON.parse(file.xhr.response);
    var name = data.files[0].name;
    file.previewElement.querySelector(".link-href").setAttribute('href', document.querySelector('meta[name="site-href"]').getAttribute('value') + name);
    file.previewElement.querySelector(".link-href").innerHTML = document.querySelector('meta[name="site-href"]').getAttribute('value') + name;
  });

  dz.on("uploadprogress", function(file, progress, bytesSent) {
    file.previewElement.querySelector(".file-progress .progress-inner").style.width = progress + "%";
  });

  // Hide the total progress bar when nothing's uploading anymore
  dz.on("queuecomplete", function(progress) {
    //document.querySelector(".file-progress").style.opacity = "0";
  });

  // Setup the buttons for all transfers
  // The "add files" button doesn't need to be setup because the config
  // `clickable` has already been specified.
  document.querySelector(".start").onclick = function() {
    dz.enqueueFiles(dz.getFilesWithStatus(Dropzone.ADDED));
  };
  document.querySelector(".cancel").onclick = function() {
    dz.removeAllFiles(true);
    document.querySelector(".start").classList.add('hidden');
    document.querySelector(".cancel").classList.add('hidden');
  };
});
