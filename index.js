const app = document.getElementById('root');
const container = document.getElementById('container');
const card = document.getElementById('card');
var city, country;

var request = new XMLHttpRequest();
var data;
request.open('GET', 'http://project-weather-0911414.s3-website-us-east-1.amazonaws.com/', true);
request.onload = function () {
    data = JSON.parse(this.response);
}
request.send();

function autocomplete(inp) {
    var currentFocus;
    inp.addEventListener("input", function (e) {
        var a, b, val = this.value;

        closeAllLists();
        if (!val) { return false; }
        currentFocus = -1;

        a = document.createElement("div");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(a);

        data.forEach(obj => {
            if (obj.name.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                b = document.createElement("div");
                b.innerHTML = `${obj.name}, ${obj.country}`;
                b.innerHTML += "<input type='hidden' value='" + `${obj.name}, ${obj.country}`  + "'>";
                b.addEventListener("click", function (e) {
                    inp.value = this.getElementsByTagName("input")[0].value;
                    closeAllLists();
                });
                a.appendChild(b);
            }
        });
    })

    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            currentFocus++;
            addActive(x);
        } else if (e.keyCode == 38) {
            currentFocus--;
            addActive(x);
        } else if (e.keyCode == 13) {
            e.preventDefault();
            if (currentFocus > -1) {
                if (x) x[currentFocus].click();
            }
        }
    });
    function addActive(x) {
        if (!x) return false;
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }
    function closeAllLists(elmnt) {
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
}

document.getElementById("submit").addEventListener("click", function () {
    var result = srch.value;
    city = result.substr(0, result.length - 4);
    country = result.substr(result.length - 2);

    var url = "http://api.openweathermap.org/data/2.5/weather?q=";
    url += `${city},${country}`;
    url += "&APPID=58b1a1a9d6457389af4eb425f206453f";
    request.open('GET', url, true);
    request.onload = function () {

        let data = JSON.parse(this.response);
        if (request.status >= 200 && request.status < 400) {
            data.weather.forEach(obj => {
                var celsius = Math.round(((data.main.temp - 273.15) * 100) / 100);
                document.getElementById("h1_id").innerHTML = `<img src="http://openweathermap.org/img/wn/${obj.icon}@2x.png">`;
                document.getElementById("h2_id").innerHTML = `${data.name}, ${data.sys.country}`;
                document.getElementById("p1_id").innerHTML = `${obj.description}
                            Temperature: ${celsius}
                            Pressure: ${data.main.pressure}
                            Humidity: ${data.main.humidity}
                            Wind: ${data.wind.speed}
                            Clouds: ${data.clouds.all}`;
            });

            container.style.visibility = 'visible';
            document.getElementById("error").style.visibility = 'hidden';

        } else {
            document.getElementById("error").style.visibility = 'visible';
        }
    }

    request.send();

});

autocomplete(document.getElementById("srch"));