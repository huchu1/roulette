const totalList = new Array(
    {id: 0, item:'heart'}, 
    {id: 1, item:'box'}, 
    {id: 2, item:'black_dye'}, 
    {id: 3, item:'blue_dye'}, 
    {id: 4, item:'doll'}, 
    {id: 5, item:'meat'}, 
    {id: 6, item:'green_dye'}, 
    {id: 7, item:'pinwheel'}, 
    {id: 8, item:'plate'}, 
    {id: 9, item:'red_dye'}, 
    {id: 10, item:'shovel'}, 
    {id: 11, item:'sickle'}, 
    {id: 12, item:'icon_axe_up_potion'}, 
    {id: 13, item:'yeopjeon'}, 
    {id: 14, item:'fail'},
    {id: 15, item:'icon_tears'},
    {id: 16, item:'icon_big_scale_02'},
);

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const body = document.getElementById('body');
const btn = document.getElementById('btn');
const modal = document.getElementById('modal');
const modalBtn = document.getElementById('modalBtn');
const modalText = document.getElementById('modalText'); 
const modalImg = document.getElementById('modalImg'); 
const id = new URLSearchParams(location.search).get('id');
const len = 360/8;
const ran = Math.floor(Math.random() * 8);
const deg = [];
const list = [];

const init = () => {
    fetch('./api/userCheck.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application.json'
        },
        body: JSON.stringify({
            id
        }),
    })
    .then(res => res.json())
    .then(data => {
        body.classList.remove('none');
        if (data[0]) {
            body.innerHTML = `<h1>오늘의 당첨 아이템</h1><br/><img src=./img/${totalList[data[1]].item}.png />`;
        } else {
            drawWheel();
        }
    });
}

const drawWheel = () => {
    for (let i = 0; i < 8; i++) {
        list.push(totalList.splice(Math.floor(Math.random() * totalList.length), 1)[0]);
    }

    ctx.translate(300, 300);
    ctx.beginPath();
    ctx.arc(0, 0, 300, 2*Math.PI, false);
    ctx.fillStyle = '#789CCE';
    ctx.fill();

    list.forEach((e, i) => {
        ctx.beginPath();
        ctx.arc(0, 0, 290, 0, len * Math.PI / 180, false);
        ctx.lineTo(0, 0);
        ctx.closePath();
        ctx.fillStyle = i % 2? '#D1EAF5': '#fff';
        ctx.fill();
        ctx.strokeStyle = '#789CCE';
        ctx.stroke();

        const image = new Image();
        image.src = './img/'+list[i].item+'.png';
        image.onload = () => {
            switch (i) {
                case 0:
                    ctx.drawImage(image, 150, 35, 80, 80);
                    break;
                case 1:
                    ctx.drawImage(image, 40, 150, 80, 80);
                    break;
                case 2:
                    ctx.drawImage(image, -120, 150, 80, 80);
                    break;
                case 3:
                    ctx.drawImage(image, -230, 35, 80, 80);
                    break;
                case 4:
                    ctx.drawImage(image, -230, -113, 80, 80);
                    break;
                case 5:
                    ctx.drawImage(image, -120, -230, 80, 80);
                    break;
                case 6:
                    ctx.drawImage(image, 40, -230, 80, 80);
                    break;
                case 7:
                    ctx.drawImage(image, 150, -113, 80, 80);
                    break; 
            }
        };
        ctx.rotate(len * Math.PI / 180);
    });
};

for (let i = 8; i > 0; i--) {
    deg.push(len*i-112.5);
};

const stopDeg = 1800 + deg[ran];

btn.addEventListener('click', () => {
    btn.classList.add('nclick');

    canvas.animate(
        {
            transform: `rotate(${stopDeg}deg)`
        },
        {
            fill: "forwards",
            duration: 2000,
            easing: 'ease'
        }
    );

    setTimeout(() => {
        fetch('./api/roulette.php', {
            method: 'POST',
            headers: {
                'Content-Type': "application.json"
            },
            body: JSON.stringify({
                id,
                item: list[ran].id
            }),
        })
        .then((res) => res.json())
        .then((data) => {
            if (data) {
                modal.classList.remove('none');
                modalText.innerHTML = list[ran].item === 'fail'? '<h3>안타깝습니다.</h3>': '<h3>'+list[ran].item+'에 당첨되셨습니다.</h3>';
                modalImg.innerHTML = `<img src=./img/${list[ran].item}.png />`;
            } else {
                alert('잘못된 접근입니다.');
            }
        });
    }, 2200);
});

modalBtn.addEventListener('click', () => {
    btn.classList.remove('nclick');
    location.reload();
});