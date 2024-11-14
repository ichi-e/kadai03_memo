const productList = [];
const cartList = [];
let totalCart = 0;
const childNum = localStorage.getItem("child_num");

// 子供の数登録。子供の数をローカルストレージに保存
$("#child_num").on("change", function () {
  const childCount = $("#child_num").val();
  console.log(childCount);
  localStorage.setItem("child_num", childCount);
})

// 子供の数だけコンテナを表示させる
// for (let i = 0; i < childNum; i++){

//   const html = `
//     <div class="product_page">
//     </div>
//   `;
//   $(".product_list").append(html);
// }

// 画像の登録
$("#img").on("change", function (e) {
  const file = e.target.files[0];
  if (file) {
    const fileReader = new FileReader();
    fileReader.onload = function (e) {
      $(".preview").html('<img src="' + e.target.result + '">')
    };
    fileReader.readAsDataURL(file);
  } 
})

// 商品登録ボタンを押した時の挙動
$("#submit").on("click", function () {
  const p_name = $("#task_name").val();
  const price = $("#price").val();
  const imageSrc = $(".preview img").attr('src') || 'img/no_img.jpg';
  const productId = Date.now().toString();

  const dataList = {
    id: productId,
    p_name: p_name,
    price: price,
    imageSrc: imageSrc,
    quantity: 0
  }

  productList.push(dataList);
  
  localStorage.setItem(productId, JSON.stringify(dataList));

  // 管理ページ表示
  const html = `
    <div class="item" data-id="${productId}">
        <figure><img src='${imageSrc}'></figure>
        <h3>${p_name}</h3>
        <p>${price}円</p>
        <button class="delete" data-id="${productId}">削除</button>
    </div>
  `;
  $(".product_area").append(html);
    
  $("#task_name").val("");
  $("#price").val("");
  $("#img").val("");
  $(".preview").html("");
})

// ストレージからの読み込み
for (let i = 0; i < localStorage.length; i++){
  const key = localStorage.key(i);
  const value = JSON.parse(localStorage.getItem(key));
  
  productList.push(value);
  
  if (key === "child_num") {
    continue
  }

  // 管理ページ表示
  const html = `
    <div class="item" data-id="${key}">
        <figure><img src='${value.imageSrc}'></figure>
        <h3>${value.p_name}</h3>
        <p>${value.price}円</p>
        <button class="delete" data-id="${key}">削除</button>
    </div>
`;
  $(".product_area").append(html);

    // 商品ページへ表示
    const productHtml = `
      <div class="item" data-id="${key}">
          <figure><img src='${value.imageSrc}'></figure>
          <h3>${value.p_name}</h3>
          <p>${value.price}円</p>
          <div class="counter">
            <input type="text" class="quantity" data-id="${key}" min="0" value="${value.quantity}">
            <button class="plus" data-id="${key}">＋</button>
          </div>
      </div>
  `;
    $(".product_page").append(productHtml);
}

// カウントアップボタン作成
$(".product_list").on("click", ".plus", function () {
  const productId = $(this).data("id");
  const item = productList.find(item => item.id == productId);
  if (item) {
    item.quantity += 1;
    localStorage.setItem(productId, JSON.stringify(item));
    $(this).siblings(".quantity").val(item.quantity);
  }
})

// お手伝いした数が変更された場合
$(".product_list").on("change", ".quantity", function () {
  const productId = $(this).data("id");
  const newQuantity = parseInt($(this).val());  //直接数字を入力すると文字列になったのでparseIntを追加

  const item = productList.find(item => item.id == productId);
  if (item) {
    item.quantity = newQuantity;
    localStorage.setItem(productId, JSON.stringify(item));
  }
})

// 管理画面タスク削除
$(".product_area").on("click", ".delete", function () {
  let removeNum = $(this).data("id");
  localStorage.removeItem(removeNum);
  $(this).closest(".item").remove();

  // 配列からも削除
  const index = productList.findIndex(item => item.id == removeNum);
  if (index != -1) {
    productList.splice(index, 1);
  }
})

// カートページへの表示
for (let i = 0; i < localStorage.length; i++){
  const key = localStorage.key(i);
  const value = JSON.parse(localStorage.getItem(key));

  if (value.quantity > 0) {
    cartList.push(value);

    const itemTotal = value.quantity * value.price;
    totalCart += itemTotal;

    // カートページへ表示
    let productHtml = `
      <div class="item" data-id="${key}">
          <figure><img src='${value.imageSrc}'></figure>
          <h3>${value.p_name}</h3>
          <p>${value.price}</p>
          <p>${value.quantity}</p>
          <p>${value.quantity * value.price}円</p>
      </div>
    `;

    $(".product_cart").append(productHtml);
    
  } 
}
// 合計金額の表示
$(".total").append(`<p>合計金額　${totalCart}円</p>`);

// 報酬を受け取った後の処理
$(".buy").on("click", function () {
  const newQuantity = 0;
  const items = productList.filter(item => item.quantity > 0);
  console.log(items);

  items.forEach(item => {
    item.quantity = newQuantity;
    localStorage.setItem(item.id, JSON.stringify(item));
  });

  $(".product_cart").empty();
  $(".cart").empty();
  $(".product_cart").append(`<p class="message">手伝ってくれてありがとう！<br>またお手伝い頑張ってね！</p>`);
  $(".total").addClass("hide");
  $(".reset_cont").addClass("hide");

})