window.onload = function () {
    let lis = document.querySelectorAll(".admin-main-left>ul>li");
    let divs = document.querySelectorAll(".admin-main-right>.table");
    let index = 0;
    divs[index].style.display = "block";
    lis[index].style.backgroundColor = "#fff";
    lis[index].style.borderLeft = "2px solid orange";
    for(let i = 0; i < lis.length; i++) {
        lis[i].onmouseenter = function () {
            lis[index].style.borderLeft = "none";
            lis[i].style.borderLeft = "2px solid orange";
            lis[index].style.backgroundColor = "#f4f8f9";
            lis[i].style.backgroundColor = "#fff";
            divs[index].style.display = "none";
            divs[i].style.display = "block";
            index = i;
        }
    }
};
