<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dux Teacher</title>

    <?php include '../include/teacherImports.php'; ?>

    <style>
        /* General styling */
        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            background-color: #f9f9f9;
        }

        .outer-container {
            display: flex;
        }

        .main-container {
            flex-grow: 1;
            padding: 30px;
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
            margin: 20px;
        }

        /* Title and description */
        .header-title {
            font-size: 24px;
            font-weight: bold;
            color: #6F2036;
            margin-bottom: 20px;
        }

        .description {
            font-size: 18px;
            color: #555;
            line-height: 1.8;
            margin-bottom: 30px;
        }

  
.listen-btn {
    position: absolute;
    top: 20px;
    right: 20px;
    background-color: #6F2036;
    color: #fff;
    font-size: 16px;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    border: none;
    z-index: 10;
    display: flex;
    align-items: center;
    gap: 10px; 
}

.listen-btn:hover {
    background-color: #8E24AA;
}

.listen-icon {
    width: 20px;
    height: 20px;
}


      
        .box-container {
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
        }

        .box {
            flex: 1 1 calc(30% - 20px);
            min-width: 200px;
            padding: 20px;
            text-align: center;
            background-color: #6F2036;
            color: #fff;
            font-size: 18px;
            font-weight: bold;
            border-radius: 10px;
            cursor: pointer;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: background-color 0.3s ease, transform 0.3s ease;
        }

        .box:hover {
            background-color: #6F2036;
            transform: translateY(-5px);
        }

   
        .popup {
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            width: 60%;
            max-height: 70%;
            border-radius: 10px;
            box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.15);
            overflow-y: auto;
            z-index: 1000;
        }

        .popup h3 {
            color: #6F2036;
            margin-bottom: 10px;
        }

        .popup ul {
            list-style: none;
            padding: 0;
        }

        .popup ul li {
            margin: 10px 0;
        }

        .popup ul li a {
            color: #6F2036;
            text-decoration: none;
            font-weight: bold;
        }

        .popup ul li a:hover {
            text-decoration: underline;
        }

        .popup-close {
            position: absolute;
            top: 10px;
            right: 10px;
            font-size: 16px;
            color: #555;
            cursor: pointer;
        }

        /* Overlay for popup */
        .overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 999;
        }
    </style>
</head>
<body>
    <?php include 'components/header.php'; ?>

    <div class="outer-container">
        <?php include 'components/sidebar.php'; ?>

        <div class="main-container">
            <button class="listen-btn" onclick="readPage()">
                <img src="../assets/icons/fi/fi-rr-speaker.svg" alt="Listen" class="listen-icon">
                
            </button>

            <h1 class="header-title">Dux- Accessibility Features</h1>
            <p class="description" id="description">
                This system is designed to assist individuals with special needs who may have difficulty reading or moving. Our features provide inclusive and accessible education, enabling remote learning and access to facilities.
            </p>

            <div class="box-container">
                <div class="box" onclick="window.location.href='https://smartclass.dux.aiiot.center';">
                    Class Remote Access
                </div>
                <div class="box" onclick="openPopup()">
                    Explore Places
                </div>
            </div>
        </div>
    </div>

    <!-- Popup for Places -->
    <div class="overlay" id="overlay" onclick="closePopup()"></div>
    <div class="popup" id="popup">
        <span class="popup-close" onclick="closePopup()">✖</span>
        <h3>Places</h3>
        <ul>
        <ul>
            <li><a href="https://tour.panoee.com/6543d2d34eb4d66bb130d466/6543d5b7ab514b9e5ccd02de" target="_blank">Faculty of Engineering</a></li>
            <li><a href="https://tour.panoee.com/654e6487d8c0de839a6735e2/654e64f4d747fd43b41c2fd9" target="_blank">NEU Hospital</a></li>
            <li><a href="https://tour.panoee.com/iframe/6545363b59dd512ab75b9e43" target="_blank">Faculty of Medicine</a></li>
            <li><a href="https://tour.panoee.com/iframe/6548f402de5d97b14cd94ff1" target="_blank">Faculty of Veterinary Medicine</a></li>
            <li><a href="https://tour.panoee.com/654e5f93d747fd07c31c2f7f" target="_blank">NEU Mosque</a></li>
            <li><a href="https://tour.panoee.com/655e2dbdd8c0de9b92679d75/655e2e3cd8c0de2a0d679d92" target="_blank">Library</a></li>
            <li><a href="https://bus.neu.edu.tr/" target="_blank">Bus Station 1</a></li>
            <li><a href="https://bus.neu.edu.tr/" target="_blank">Bus Station 2</a></li>
            <li><a href="https://tour.panoee.com/656defa5d8c0de211a6811d0/656defd2d747fd6eff1d1363" target="_blank">Faculty of Communications</a></li>
            <li><a href="https://tour.panoee.com/656ded4cd747fd62681d1336/656dee23d747fd3e931d1345" target="_blank">Faculty of Dentistry</a></li>
            <li><a href="https://tour.panoee.com/655e70c7d8c0de8dd6679ed2/655e7171d8c0def22d679ee4" target="_blank">Faculty of Pharmacy</a></li>
            <li><a href="https://tour.panoee.com/654b3de0d8c0deb015671e08" target="_blank">Preparatory School</a></li>
            <li><a href="https://tour.panoee.com/6580afcad747fd390c1d7aa0" target="_blank">NEU Car Museum</a></li>
            <li><a href="https://tour.panoee.com/65dfb3b494b642d9e115cfe2/65dfb4367a73f274fe4da8ab" target="_blank">NEU Lake</a></li>
            <li><a href="https://tour.panoee.com/65c6474b01a42077b5de295b/65c64a1001a42021b3de2973" target="_blank">Faculty of Health Science</a></li>
            <li><a href="https://tour.panoee.com/664f601bfe60db9991c93887/664f6031fe60db8b4fc93892" target="_blank">Faculty of Architecture</a></li>
            <li><a href="https://tour.panoee.com/664f4cc442adc5803e3ac479/664f4d84fe60db7cc5c937e5" target="_blank">Faculty of Law</a></li>
            <li><a href="https://tour.panoee.com/662912affb11a6d28393ad82/66291475fb11a6632093adad" target="_blank">Faculty of Arts and Sciences</a></li>
            <li><a href="https://tour.panoee.com/662912affb11a6d28393ad82/66291475fb11a6632093adad" target="_blank">Faculty of Economics and Administrative</a></li>
        </ul>
    </div>

    <script>
        // Function to read the entire page content
        function readPage() {
            const content = [];
            content.push(document.querySelector('.header-title').textContent);
            content.push(document.querySelector('.description').textContent);
            const speech = new SpeechSynthesisUtterance(content.join('. '));
            speech.lang = 'en-US';
            window.speechSynthesis.speak(speech);
        }

        // Popup functions
        function openPopup() {
            document.getElementById('popup').style.display = 'block';
            document.getElementById('overlay').style.display = 'block';
        }

        function closePopup() {
            document.getElementById('popup').style.display = 'none';
            document.getElementById('overlay').style.display = 'none';
        }
    </script>
</body>
</html>