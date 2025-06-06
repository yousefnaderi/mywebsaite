function register() {
  const username = document.getElementById("username").value.trim();
  const fileInput = document.getElementById("photo");
  const file = fileInput.files[0];

  if (!username) {
    alert("لطفاً نام کاربری را وارد کنید.");
    return;
  }

  // جستجو در دیتابیس برای بررسی ثبت‌نام قبلی
  const whereClause = `username = '${username}'`;
  const queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(whereClause);

  Backendless.Data.of("Users").find(queryBuilder)
    .then(users => {
      if (users.length > 0) {
        // کاربر قبلاً ثبت‌نام کرده
        alert("خوش آمدی، " + username + "!");
        localStorage.setItem("currentUser", JSON.stringify(users[0]));
        window.location.href = "home.html"; // تغییر بده به صفحه اصلی واقعی شما
      } else {
        // اگر کاربر جدید بود، عکس هم نیاز داریم
        if (!file) {
          alert("شما کاربر جدید هستید. لطفاً یک عکس انتخاب کنید.");
          return;
        }

        // 1. آپلود عکس
        const fileName = "photos/" + Date.now() + "_" + file.name;
        Backendless.Files.upload(file, "photos", true)
          .then(result => {
            const photoUrl = result.fileURL;

            // 2. ذخیره کاربر
            const userData = {
              username: username,
              photoUrl: photoUrl
            };

            return Backendless.Data.of("Users").save(userData);
          })
          .then(savedUser => {
            alert("ثبت‌نام موفق بود، " + username + "!");
            localStorage.setItem("currentUser", JSON.stringify(savedUser));
            window.location.href = "home.html"; // برو به صفحه بعد
          });
      }
    })
    .catch(error => {
      console.error(error);
      alert("خطا: " + error.message);
    });
}