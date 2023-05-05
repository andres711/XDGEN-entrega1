$(document).ready(function () {
  showUsers();
  actionsUser();
  togleForm();
});
var URL = "https://645413e9c18adbbdfeaefa47.mockapi.io/users2";

function showUsers() {
  $.ajax({
    url: URL,
    type: "GET",
    dataType: "json",
  })
    //done
    .done(function (response) {
      var users = $("#datos");
      users.find(".card").remove();
      for (var i = 0; i < response.length; i++) {
        var card = $("<div></div>").data("userId", response[i].id);
        card.addClass("card");
        var cardBody = $("<div></div>").addClass("card-body");
        var cardTitle = $("<h5></h5>")
          .addClass("card-title")
          .html("Fullname: " + response[i].name);
        var cardTextAge = $("<p></p>")
          .addClass("card-text")
          .html("Age: " + response[i].age);
        var imagen = $("<img>").attr("src", response[i].avatar);
        var job = $("<p></p>")
          .addClass("card-text")
          .html("Job: " + response[i].job);
        var country = $("<p></p>")
          .addClass("card-text")
          .html("Country: " + response[i].country);
        var id = $("<p></p>")
        .addClass("card-text")
        .html("Id: " + response[i].id);
        var deleteButton = $("<button>")
          .text("Delete")
          .addClass("btn btn-danger")
          .click(function () {
            var userId = $(this).closest(".card").data("userId");
            deleteUser(userId);
          });
        var editButton = $("<button>")
          .text("Edit")
          .addClass("btn btn-success")
          .click(function () {
            var userId = $(this).closest(".card").data("userId");
            $("#togle-form").prop("checked", true);
            getUserById(userId).then((data) => fillForm(data));
          });
        cardBody.append(cardTitle);
        cardBody.append(cardTextAge);
        cardBody.append(imagen);
        cardBody.append(country);
        cardBody.append(job);
        cardBody.append(id);
        card.append(cardBody);
        card.append(deleteButton);
        card.append(editButton);
        $("#datos").append(card);
      }
    })
    //fail
    .fail(function (error) {
      console.log(error);
    });
}

function actionsUser() {
  $("#form-user").submit(function (event) {
    event.preventDefault();
    if ($("#togle-form").prop("checked")) {
      editUser();
    } else {
      createUser();
    }
  });
}

function deleteUser(id) {
  $.ajax({
    url: URL + "/" + id,
    method: "DELETE",
  })
    .done(function () {
      showUsers();
    })
    .fail(function (error) {
      console.log(error);
    });
}
function togleForm() {
  $("#togle-form").change(function () {
    if ($(this).is(":checked")) {
      $("#title-form").html("Edit");
    } else {
      $("#title-form").html("Create");
    }
  });
}

function getUserById(id) {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "GET",
      url: URL + "/" + id,
    })
      //done
      .done(function (data) {
        resolve(data);
      })

      //fail
      .fail(function (error) {
        reject("Error al obtener elemento: " + error);
      });
  });
}

function fillForm(data) {
  $("#name").val(data.name);
  $("#age").val(data.age);
  $("#country").val(data.country);
  $("#job").val(data.job);
  $("#id").val(data.id);
}

function editUser() {
  var userEdit = {
    id:$("#id").val(),
    name: $("#name").val(),
    age: $("#age").val(),
    job: $("#job").val(),
  };
  console.log(userEdit.id);
  $.ajax({
    url: URL + "/" + userEdit.id,
    method: "PUT",
    data: userEdit,
  })
    //done
    .done(function () {
      alert("Usuario editado correctamente: ");
      showUsers();
    })
    //fail
    .fail(function (error) {
      console.error(error);
    });
}

function createUser() {
  var user = {
    name: $("#name").val(),
    age: $("#age").val(),
    country: $("#country").val(),
    job: $("#job").val(),
  };

  if (
    user.name === "" ||
    user.age === "" ||
    user.country == "" ||
    user.job == ""
  ) {
    alert("Al fields are required");
    return
  }
  $.ajax({
    type: "POST",
    url: URL,
    data: JSON.stringify(user),
    contentType: "application/json",
  })
    //done
    .done(function (response) {
      alert("¡Formulario enviado correctamente!");
      console.log(response);
      $("#form-user")[0].reset();
      showUsers();
    })

    //fail
    .fail(function (error) {
      alert("Hubo un error al enviar el formulario: " + error);
    });
}
