require('./main.css')

// @ts-ignore
import ConfettiGenerator from 'confetti-js'

const baseUrl = 'https://enigmatic-coast-18734.herokuapp.com'
const uploadUrl = `${baseUrl}/upload-stem`
const postUrl = `${baseUrl}/post-song`


const handleFormSubmit = async (e: SubmitEvent, form: HTMLFormElement) => {
    e.preventDefault()

    const fd = new FormData(form)

    for(let i = 1; i < 8; i++) {
        fd.delete(`file-upload-${i}`)
    }

    console.log(fd.get('stem-1-cid'))

    const XHR = new XMLHttpRequest();


    // Define what happens on successful data submission
    XHR.addEventListener( "load", function(event) {
        console.log('siccess')
        try {
            const data = JSON.parse(XHR.response)
            console.log(data)
        } catch (error) {
            
        }
    } );

    // Define what happens in case of error
    XHR.addEventListener( "error", function( event ) {
      alert( 'Oops! Something went wrong.' );
    } );

    // Set up our request
    XHR.open( "POST", postUrl );

    // The data sent is what the user provided in the form
    XHR.send( fd );

}



window.addEventListener('load', () => {

    var confettiSettings = { target: 'confetti-canvas',
    props: [
            {type: 'svg', src: 'assets/quarterNote.svg'},
            {type: 'svg', src: 'assets/quarterNotes.svg'},
            {type: 'svg', src: 'assets/piano.svg'},
            {type: 'svg', src: 'assets/trumpet.svg'}
        ],
        rotate: true,
        size: 3,
        
    };  
    var confetti = new ConfettiGenerator(confettiSettings);
    confetti.render();


    // handling for submit of creating an experience
    const form = document.getElementsByTagName('form')[0]
    form?.addEventListener('submit', (e) => {
        handleFormSubmit(e, form)
    })


    // handling for all stem file uploads!
    const stemUploads = document.getElementsByClassName('stem-upload') as HTMLCollectionOf<HTMLInputElement>
    for(const stem of stemUploads) {
        stem.onchange = (evt) => {
            console.log(stem.files)

            if(stem.files?.length == 0)
                return

            const file = stem.files!.item(0)

            const labelElem = stem.parentElement!.children[0]

            labelElem.innerHTML = 'Uploading ' + file!.name + ' ...'

            const ajax = new XMLHttpRequest()
            const formData = new FormData()
            formData.append('stem', file!)

            ajax.upload.addEventListener('progress', (p) => {console.log(p)}, false)
            ajax.addEventListener('load', (l) => {
                console.log(l)
                console.log(ajax.response)

                try {
                    const data = JSON.parse(ajax.response)
                    const cid = data.data.cid
                    if(cid) {
                        labelElem.innerHTML = 'Uploaded ' + file!.name + '!'

                        // add in label below to cid
                        labelElem.parentElement!.parentElement!.parentElement!.children[1].innerHTML = cid

                        // set invisible input
                        stem.parentElement!.children[2].setAttribute('value', cid)

                    } else {
                        throw new Error('upload error')
                    }
                } catch (error) {
                    labelElem.innerHTML = 'Error uploading, please try again.'
                }


            })

            ajax.open('POST', uploadUrl, true)
            ajax.send(formData)



        }
    }


    // var file = document.getElementById('id of your input:file').files[0];
    // var ajax = new XMLHttpRequest;

    // var formData = new FormData;
    // formData.append('imagefile', file);

    // ajax.upload.addEventListener("progress", myProgressHandler, false);
    // ajax.addEventListener('load', myOnLoadHandler, false);
    // ajax.open('POST', 'upload.php', true);
    // ajax.send(formData);

})