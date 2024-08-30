const baseURL = `https://apitechserver.onrender.com/data`; //request atacağımız baseURL

//DOM elemanlarına erişim sağlıyoruz.
var sceneContainer = document.getElementById('scene-container');
var loading = document.getElementById('loading');
var sceneContainerStyleData =[];
var componentsData = [];
var fetchedData = [];
async function initializeApp() {
    try {
        // 
        const response = await fetch(`${baseURL}`);

        if (!response.ok) {
            throw new Error('Network response was not ok!');
        }

        fetchedData = await response.json();

        console.log(fetchedData[0].style)
        sceneContainerStyleData = fetchedData[0].style;
        componentsData = fetchedData[0].components;

        // Sahne boyutunu ayarlıyoruz.
        sceneContainer.style.width = sceneContainerStyleData.width;
        sceneContainer.style.height = sceneContainerStyleData.height;

        // Loading state'i gizliyoruz.
        loading.style.display = 'none';

        // Componentleri çetiğimiz fonksiyon.

                // Video komponentlerinin dinamik olarak oluşturuyoruz
                componentsData.forEach(component => {
                    createVideoComponent(sceneContainer, component);
                });


    } catch (error) {
        handleError(error, 'There was a problem with fetching data');

    }
}



// Error gösterme metotu
function handleError(error, message) {
    console.error(message, error);
    showError(`${message}: ${error}`);
    loading.style.display = 'none';
}

// Dinamik hata mesajı gösterme fonksiyonu
function showError(message) {
    const errorMessage = document.createElement('div');
    errorMessage.innerText = message;
    errorMessage.style.color = 'red';
    errorMessage.style.fontSize = '2rem';

    sceneContainer.style.display = 'flex';
    sceneContainer.style.alignItems = 'center';
    sceneContainer.style.justifyContent = 'center';
    sceneContainer.appendChild(errorMessage);
}

// Video bileşeni oluşturma fonksiyonu
function createVideoComponent(container, component) {
    // Video bileşeni oluşturma
    const video = createVideoElement(component);
    
    // Video stilini atama
    applyVideoStyles(video, component.style);
    
    // Video olay dinleyicilerini ekleme
    addVideoEventListeners(video, component);
    
    // Videoyu konteynera ekleme
    container.appendChild(video);
}

// Video elementini oluşturma fonksiyonu
function createVideoElement(component) {
    const video = document.createElement('video');
    video.src = component.file;
    video.id = component.id;
    video.className = component.class;
    
    // Video kontrol öğelerini gösterme
    video.controls = true;
    video.muted = true; // Videoları otomatik oynatmak için sessiz moda alıyoruz.
    video.autoplay = true; // Videoları otomatik oynatıyoruz
    
    return video;
}

// Video stilini uygulama fonksiyonu
function applyVideoStyles(video, styles) {
    Object.assign(video.style, styles);
}

// Video olay dinleyicilerini ekleme fonksiyonu
function addVideoEventListeners(video, component) {
    let videoDuration = 0;

    // Videonun toplam süresine erişim
    video.addEventListener('loadedmetadata', () => {
        videoDuration = video.duration; // Videonun toplam süresi (saniye cinsinden)
    });

    // Videonun her oynatma durumunda güncellenmesi için 'timeupdate' olayını dinleyin
    video.addEventListener('timeupdate', function () {
        // Eğer video süresi duration'a ulaştıysa durdur
        if (video.currentTime >= component.info.duration) {
            video.pause();

            // Repeat özelliği varsa, videoyu başa sarıp tekrar oynat
            if (component.info.repeat) {
                video.currentTime = 0; // Videoyu başa sar
                video.play();
            }
        } 
        // Bu kod bloğu, ilk videonun toplam süresi normalde 14sn ancak duration olarak 20sn verildiğinden başa dönüp kalan duration kadar tekrar edip durmasını sağlıyor.
        else if(video.currentTime == videoDuration) {
            video.currentTime = 0; // Videoyu başa sar
            video.play();
            setTimeout(() => {
                video.pause();
            }, (component.info.duration - videoDuration) * 1000);
        }
    });
}



// Oluşturduğumuz uygulamayı çağırıyoruz.
initializeApp()