let node = { val: 6, color: "gray", left: { val: 4, left: { val: 1, right: { val: 2 } }, right: { val: 5 } }, right: { val: 8, right: { val: 9 } } };

let translate = { x: 0, y: 0 };
let scale = 1;

$(() => {
    const resize = $("#play-middle");
    const left = $("#play-left");
    const right = $("#play-right");
    const box = $("#play-container");
    const canvas = $("#play-view");

    const applyResize = () => {
        right.css("width", (box.width() - left.width() - 5) + "px");
        canvas.attr({
            width: canvas.width(),
            height: canvas.height()
        });
        redraw(canvas);
    };

    $(document).resize(applyResize);

    resize.mousedown((e) => {
        const mouseMove = (e) => {
            let x = e.pageX - box.offset().left;
            x = Math.max(x, box.width() * 0.10);
            x = Math.min(x, box.width() * 0.90);

            left.css("width", x + "px");
            applyResize();
        };

        const mouseUp = (e) => {
            $(document).unbind("mousemove", mouseMove);
            $(document).unbind("mouseup", mouseUp);
        };

        $(document).mousemove(mouseMove);
        $(document).mouseup(mouseUp);
    });

    $(window).resize(applyResize);
    applyResize();
});

function redraw(canvas) {
    if (!canvas[0].getContext) return;
    const ctx = canvas[0].getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width(), canvas.height());
    ctx.fillStyle = "black";
    ctx.textAlign = "left";
    ctx.font = "16px 微软雅黑";

    let w = canvas.width();
    let h = canvas.height();
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.scale(scale, scale);
    ctx.translate(-w / 2, -h / 2);
    ctx.translate(w / 2 + translate.x, h / 8 + translate.y);
    ctx.textAlign = "center";


    const drawNode = (node, depth) => {
        ctx.beginPath();
        ctx.arc(0, -4, 24, 0, 2 * Math.PI);
        if (node.color) {
            ctx.fillStyle = node.color;
            ctx.fill();
        } else {
            ctx.stroke();
        }
        ctx.fillStyle = "black";
        ctx.beginPath();
        if (node.left) {
            ctx.moveTo(0, 20);
            ctx.lineTo(-8 * Math.pow(2, depth), 72);
        }
        if (node.right) {
            ctx.moveTo(0, 20);
            ctx.lineTo(8 * Math.pow(2, depth), 72);
        }
        ctx.stroke();
        ctx.fillText(node.val, 0, 0);

        if (node.left) {
            ctx.save();
            ctx.translate(-8 * Math.pow(2, depth), 100);
            drawNode(node.left, depth - 1);
            ctx.restore();
        }
        if (node.right) {
            ctx.save();
            ctx.translate(8 * Math.pow(2, depth), 100);
            drawNode(node.right, depth - 1);
            ctx.restore();
        }
    };

    drawNode(node, getTreeDepth(node));

    ctx.restore();
}

function getTreeDepth(node) {
    return Math.max(node.left ? getTreeDepth(node.left) : 0, node.right ? getTreeDepth(node.right) : 0) + 1;
}

$(() => {
    const updateTranslateInfo = () => {
        $("#canvas-info").text(`平移：(${translate.x.toFixed(0)}, ${translate.y.toFixed(0)}) 缩放：${(scale * 100).toFixed(0)}%`);
    };

    let canvas = $("#play-view");
    canvas.mousedown((e) => {
        let start = { x: e.clientX, y: e.clientY };
        const mouseMove = (e) => {
            let move = { x: e.clientX, y: e.clientY };
            translate.x += (move.x - start.x) / scale;
            translate.y += (move.y - start.y) / scale;

            updateTranslateInfo();
            redraw(canvas);
            start = move;
        };

        const mouseUp = (e) => {
            $(document).unbind("mousemove", mouseMove);
            $(document).unbind("mouseup", mouseUp);
        };

        $(document).mousemove(mouseMove);
        $(document).mouseup(mouseUp);
    });

    const mouseWheel = (delta) => {
        scale += (delta > 0 ? 1 : -1) * 0.1;
        scale = Math.max(0.1, scale);
        scale = Math.min(10, scale);
        updateTranslateInfo();
        redraw(canvas);
    };
    canvas.bind("mousewheel", (e) => mouseWheel(e.originalEvent.wheelDelta));
    canvas.bind("DOMMouseScroll", (e) => mouseWheel(-e.detail));

    updateTranslateInfo();
    redraw(canvas);
});
