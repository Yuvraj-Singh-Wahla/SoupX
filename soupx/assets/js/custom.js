var plan = {};
plan.days = [];
// plan.lunch = ['Soup', 'Salad'];
// plan.dinner = ['Soup', 'Salad'];
var goalIds = ['looseW', 'healthyEat', 'muscleG', 'detox', 'lightD', 'notS',];
var optionalItemIds = ['opt1', 'opt2', 'opt3'];
var prefIds = ['veg', 'nonVeg', 'vegan', 'egg'];
var allergenIds = ['noAllergen', 'nutFree', 'glutenFree'];
var subPlan = ['1stp', '2ndp', '3rdp', '4thp', '5thp', '6thp'];
var salad_cost = 57;
var soup_cost = 78;
var fullMealcost = 0;
var vegPlan = [
    {
        name: 'Trial 1 Day',
        days: 1,
        soup_cost: 249,
        salad_cost: 199
    },
    {
        name: 'Trial 3 Days',
        days: 3,
        soup_cost: 229,
        salad_cost: 189
    },
    {
        name: 'Wellness 7 Days',
        days: 7,
        soup_cost: 219,
        salad_cost: 179
    },
    {
        name: 'Wellness 14 Days',
        days: 14,
        soup_cost: 199,
        salad_cost: 169
    },
    {
        name: 'Fit 21 Days',
        days: 21,
        soup_cost: 179,
        salad_cost: 159
    },
    {
        name: 'Fit 28 Days',
        days: 28,
        soup_cost: 169,
        salad_cost: 149
    }
];

var nonVegPlan = [
    {
        name: 'Trial 1 Day',
        days: 1,
        soup_cost: 269,
        salad_cost: 219
    },
    {
        name: 'Trial 3 Days',
        days: 3,
        soup_cost: 249,
        salad_cost: 199
    },
    {
        name: 'Wellness 7 Days',
        days: 7,
        soup_cost: 239,
        salad_cost: 189
    },
    {
        name: 'Wellness 14 Days',
        days: 14,
        soup_cost: 219,
        salad_cost: 179
    },
    {
        name: 'Fit 21 Days',
        days: 21,
        soup_cost: 199,
        salad_cost: 169
    },
    {
        name: 'Fit 28 Days',
        days: 28,
        soup_cost: 179,
        salad_cost: 159
    }
];
var coupons = {
    'WELCOME': 300,
    'ANYTIMEFITNESS': 500,
    'GOLDGYM': 500,
    'CULTFIT': 500,
    'SOUPERSTAR': 50,
    'SOUPX50': 50,
    'GOWRI': 500,
    'PRINCY': 500,
    'AISHWARYA': 500
};

// var vegPlan = ['249', '687', '1,533', '2,786', '3,759', '4,732'];
// var nonVegPlan = ['269', '747', '1,673', '3,066', '4,179', '5,012'];
// var vegMeal = [249, 229, 219, 199, 179, 169];
// var nonVegMeal = [269, 249, 239, 219, 199, 179];

var discount = {
    1: 0,
    2: 0.10,
    3: 0.15,
    4: 0.20
}
plan.add_ons = "None";
plan.addons = 0;
plan.price = 249;
plan.discount_price = 0;
plan.discounted_price = plan.price;
plan.meals = ['Soup-Lunch']
plan.meal = 'Vegetarian';
plan.fullMeal = 'No';
plan.preference = [];
plan.optionalItems = [];
plan.selected_plan = { name: 'Trial 1 Day', price: 249, days: 1, soup_cost: 249, salad_cost: 199 };
// setSchedule();
function init() {
    $('#apply_coupon').on('click', function (e) {
        e.preventDefault();
        applyCoupon();
    })
    $('#wrapped').on('submit', function (e) {
        e.preventDefault();
        if (!setSchedule()) {
            $('#loader_form').css('display', '');
            return;
        }
        console.log(plan);
        var data = {
            name: $('#name').val(),
            email: $('#email').val(),
            phone: $('#phone').val(),
            address: $('#address_1').val() + ' ' + $('#address_2').val(),
            city: $('#city').val(),
            pincode: $('#pincode').val(),
            landmark: $('#landmark').val(),
            plan: JSON.stringify(plan)
        };
        $.ajax({
            url: 'api/api.php',
            type: 'POST',
            data: data,
            success: function (response) {
                response = JSON.parse(response);
                if (response.status) {
                    payment(response.data);
                    // location.reload();
                } else {
                    alert('Error');
                }
            }
        });
    });

    var customPlanDays = "<option value='0'>Select Days</option>";
    for (let i = 2; i <= 28; i++) {
        customPlanDays += `<option value="${i}">${i} Days</option>`;
    }
    $('#customDays').html(customPlanDays);
}

function buildCustomPlan() {
    let days = parseInt($('#customDays').val());
    let cost = (days <= 6) ? 239 : (days > 6 && days <= 13) ? 209 : (days > 13 && days <= 21) ? 189 : (days > 21 && days <= 28) ? 169 : 0;
    let totalCost = days * cost;
    $('#customPlanCost').text(cost);
    $('#customPlanTotalCost').html(`<tiny>₹</tiny> ${totalCost}`);
    $('#noMeals').text(days);
    setPlan(`Custom ${days} Days`, totalCost, days, '4thp');
}
function setStartDate() {
    plan.startDate = $('#startDate').val();
    console.log(plan);
}
function setOptionalItems(item, price, id) {
    if (plan.optionalItems.includes(item)) {
        plan.optionalItems.splice(plan.optionalItems.indexOf(item), 1);
        $(`#${id}`).parent().parent().css('background-color', 'white');
        // $(`#${id}`).parent().parent().css('color', 'black');
    } else {
        plan.optionalItems.push(item);
        $(`#${id}`).parent().parent().css('background-color', 'rgb(117 224 87 / 55%)');
        // $(`#${id}`).parent().parent().css('color', 'white');
    }
    showPlanDetails();
    console.log(plan);
}
function setFullMeal(t, id, id_) {
    plan.fullMeal = t;
    if (t == 'Yes') fullMealcost = 99;
    else fullMealcost = 0;
    showPlanDetails();
    $(`#${id}`).parent().parent().css('background-color', 'rgb(117 224 87 / 55%)');
    $(`#${id_}`).parent().parent().css('background-color', 'white');
    console.log(plan);
}

$(".goal-card").click(function () {
    plan.goal = $(this).data('goal');
    $("#s_goal").prop("innerHTML", plan.goal);
    $(".goal-card").css('background-color', 'white');
    $(this).css('background-color', 'rgba(117, 224, 87, 0.55)');
    setActiveStep(1);
    setActivePanel(1);
})

function setGoal(goal, id) {
    plan.goal = goal;
    $(`#${id}`).parent().parent().css('background-color', 'rgb(117 224 87 / 55%)');
    // $(`#${id}`).parent().parent().css('color', 'white');
    for (let i = 0; i < goalIds.length; i++) {
        if (goalIds[i] != id) {
            $(`#${goalIds[i]}`).parent().parent().css('background-color', 'white');
            // $(`#${goalIds[i]}`).parent().parent().css('color', 'black');
        }
    }
    console.log(plan);
    setActiveStep(1);
    setActivePanel(1);
    // document.getElementById("goal").classList.remove("js-active");
    // document.getElementById("meal").classList.add("js-active");
}
function setFoodPreference(pref, id) {

    if (plan.preference.includes(pref)) {
        plan.preference.splice(plan.preference.indexOf(pref), 1);
        $(`#${id}`).parent().parent().css('background-color', 'white');
        // $(`#${id}`).parent().parent().css('color', 'black');
    } else {
        plan.preference.push(pref);
        $(`#${id}`).parent().parent().css('background-color', 'rgb(117 224 87 / 55%)');
        // $(`#${id}`).parent().parent().css('color', 'white');
    }

    /* plan.preference = pref;
    $(`#${id}`).parent().parent().css('background-color', 'rgb(117 224 87 / 55%)');
    // $(`#${id}`).parent().parent().css('color', 'white');
    for(let i = 0; i < prefIds.length; i++){
        if(prefIds[i] != id){
            $(`#${prefIds[i]}`).parent().parent().css('background-color', 'white');
            // $(`#${goalIds[i]}`).parent().parent().css('color', 'black');
        }
    } */
    console.log(plan);
}
function setAllergens(allergen, id) {
    plan.allergens = allergen;
    $(`#${id}`).parent().parent().css('background-color', 'rgb(117 224 87 / 55%)');
    // $(`#${id}`).parent().parent().css('color', 'white');
    for (let i = 0; i < allergenIds.length; i++) {
        if (allergenIds[i] != id) {
            $(`#${allergenIds[i]}`).parent().parent().css('background-color', 'white');
            // $(`#${goalIds[i]}`).parent().parent().css('color', 'black');
        }
    }
    console.log(plan);
}

//Selecting meals for lunch
// function setLunch(eat) {
//     if (plan.lunch.length == 0) {
//         plan.lunch.push(eat);
//     }
//     else {
//         if (plan.lunch.includes(eat)) {
//             let index = plan.lunch.indexOf(eat);
//             plan.lunch.splice(index, 1);
//         } else {
//             plan.lunch.push(eat);
//         }
//     }
//     console.log(plan.lunch);
// }

// //Selecting meals for dinner
// function setDinner(eat) {
//     if (plan.dinner.length == 0) {
//         plan.dinner.push(eat);
//     }
//     else {
//         if (plan.dinner.includes(eat)) {
//             let index = plan.dinner.indexOf(eat);
//             plan.dinner.splice(index, 1);
//         } else {
//             plan.dinner.push(eat);
//         }
//     }
//     console.log(plan.dinner);
// }

//Meals per day selector
$("#mealSelector").click(async (e) => {
    const target = $(e.target);
    if (target.prop("checked") === true) {
        if (target.data("meal") === "soup")
            plan.price += plan.selected_plan.days * plan.selected_plan.soup_cost;
        if (target.data("meal") === "salad")
            plan.price += plan.selected_plan.days * plan.selected_plan.salad_cost;
        plan.meals.push($(e.target).prop("name"));
        console.log(plan.price);
        console.log("Checked");
    }
    if ($(e.target).prop("checked") === false) {
        if (target.data("meal") === "soup")
            plan.price -= plan.selected_plan.days * plan.selected_plan.soup_cost;
        if (target.data("meal") === "salad")
            plan.price -= plan.selected_plan.days * plan.selected_plan.salad_cost;
        plan.meals.splice(plan.meals.indexOf($(e.target).prop("name")), 1);
        console.log(plan.price);
        console.log("Unchecked");
    }
    $("#s_meals").text(plan.meals);

    plan.discount_price = parseInt(plan.price * (discount[plan.meals.length]));
    plan.discounted_price = plan.price - plan.discount_price;
    priceDisplay();
});

function priceDisplay() {
    if (plan.price === 0) {
        $(".price-display-container").hide();
    }
    else {
        $(".price-display-container").show();
    }
    $("#b_plan_price").prop("innerHTML", "₹ " + plan.price);
    $("#b_discount_price").prop("innerHTML", "₹ " + plan.discount_price);
    $("#b_discounted_price").prop("innerHTML", "₹ " + plan.discounted_price);

    plan.total = plan.discounted_price;
    $("#d_plan_price").text("₹ " + plan.total);
    plan.total += plan.addons * plan.selected_plan.days;
    $("#d_addons").text("₹ " + ($("#addons").val() * plan.selected_plan.days));
    $("#d_ppadd").text("₹ " + (plan.discounted_price + parseInt($("#addons").val()) * parseInt(plan.selected_plan.days)))
    $("#d_gst").text("₹ " + (0.05 * plan.total).toFixed(2));
    plan.total += (0.05 * plan.total);
    $("#d_total_amount").text("₹ " + plan.total);
}

//Plan Price Breakdown updater
// setInterval(() => {
//     priceDisplay();
// }, 500)

$(".messup").click(function () {
    plan.sex = $(this).data("gender");
    $(".messup").each(function () {
        $(this).css("background-color", "white");
    })
    $(this).css("background-color", "rgb(117 224 87 / 55%)");
    $("#s_gender").text(plan.sex);
})

function setGender(gender, id, _id) {
    plan.sex = gender;
    $(`#${id}`).parent().css('background-color', 'rgb(117 224 87 / 55%)');
    $(`#${id}`).parent().css('color', 'white');
    $(`#${_id}`).parent().css('background-color', '');
    $(`#${_id}`).parent().css('color', '');
    $("#s_gender").text(plan.sex);
    console.log(plan);
}
function setBMIData() {
    let w = $('#weight').val();
    let a = $('#age').val();
    if (w < 0) w = w * -1;
    if (a < 0) a = a * -1;
    plan.height = $('#height').val();
    plan.weight = w;
    $('#weight').val(w);
    plan.age = a;
    $('#age').val(a);
    console.log(plan);
}

function setName() {
    plan.name = $('#name').val();
    $("#s_name").text(plan.name);
}

function setPhone() {
    plan.phone = $('#phone').val();
    $("#s_phone").text(plan.phone);
}

function setAddress() {
    let a = $("#address_1").val();
    let landmark = $("#landmark").val();
    plan.pincode = $("#pincode").val();
    plan.city = $("#city").val();
    plan.address = a + " Landmark: " + landmark;
    $("#s_address").text(plan.address);
    $("#s_city").text(plan.city);
    $("#s_pincode").text(plan.pincode);

}

function setNotesAndNext() {
    plan.notes = $('#notes').val();
    $('#nextButton').trigger('click');
    $('#nextButton').css('display', '');

}
function setNotes() {
    plan.notes = $('#notes').val();
    console.log(plan);
}

function updatePlan(mealPrice, planPrice) {
    $(".price-per-meal").each(function (i) {
        $(this).text(mealPrice[i]);
    });

    $(".plan-price").each(function (i) {
        $(this).text(planPrice[i]);
    });
}

function prefCard() {
    var selectedPref = $(this).data('pref');
    plan.meal = selectedPref;
    $(".pref-card").css('background-color', 'white');
    $(this).css('background-color', 'rgba(117, 224, 87, 0.55)');
    if (selectedPref === "Vegetarian") {
        $(".vegPlan").removeClass("hidden");
        $(".nonVegPlan").addClass("hidden");
        $("#vegClick").click();
    }
    if (selectedPref === "Non-Vegetarian") {
        $(".vegPlan").addClass("hidden");
        $(".nonVegPlan").removeClass("hidden");
        $("#nonVegClick").click();
    }
    $("#s_prefs").text(plan.meal);
}

$(".pref-card").click(prefCard);

function setMeal(meal, id) {
    plan.meal = meal;
    $(`#${id}`).parent().parent().css('background-color', 'rgb(117 224 87 / 55%)');
    if (id == 'vegita') {
        setPlan('Trial 1 Day', 249, 1, '1stp', 249, 199);
        $(`#nonvegita`).parent().parent().css('background-color', '');
        updatePlan(vegMeal, vegPlan);
    }
    if (id == 'nonvegita') {
        setPlan('Trial 1 Day', 269, 1, '1stp', 269, 219);
        $(`#vegita`).parent().parent().css('background-color', 'white');
        updatePlan(nonVegMeal, nonVegPlan);
    }
}

function selectAllDays() {
    $(".checked-checkbox").each(function () {
        if ($("#allDays").prop("checked") === true) {
            $(this).prop('checked', true);
            plan.days = ['Monday', 'Tuesday', 'Wednesda', 'Thursday', 'Friday', 'Saturday'];
        }
        if ($("#allDays").prop("checked") === false) {
            $(this).prop('checked', false);
            plan.days = [];
        }
    });
}

$(".daySelector").click(function () {
    const day = $(this).val();
    if (day === "all") {
        selectAllDays();
    }
    if (day !== 'all') {
        if ($(this).prop('checked') === true) {
            plan.days.push(day);
        }
        else {
            plan.days.splice(plan.days.indexOf(day), 1);
        }
    }
    console.log(plan.days);
    $("#s_days").text(plan.days);
})

// function setDays(day) {
//     // days.push(day);
//     if (days.length == 0) {
//         days.push(day);
//         // $(`#${id}`).css('background-color', '#c5c50c');
//     } else {
//         if (days.includes(day)) {
//             let index = days.indexOf(day);
//             days.splice(index, 1);
//             // $(`#${id}`).css('background-color', 'rgb(199, 193, 193)');
//         } else {
//             days.push(day);
//             // $(`#${id}`).css('background-color', '#c5c50c');
//         }
//     }
//     console.log(days);
// }
function setSchedule() {
    if (days.length == 0) {
        alert('Please select atleast one day');
        return false;
    } else {
        plan.days = days;
        return true;
    }
}

//satak

$(".plan-card").click(function () {
    console.log($(this));
    $(".plan-card").css('background-color', 'white');
    $(this).css('background-color', 'rgba(117, 224, 87, 0.55)');
    if (plan.meal === "Vegetarian") {
        console.log('Vegetarian');
        console.log(vegPlan[$(this).data('i')]);
        plan.selected_plan = vegPlan[$(this).data('i')];
        plan.selected_plan.price = plan.selected_plan.soup_cost * plan.selected_plan.days;
        plan.price = plan.selected_plan.price;

    }
    if (plan.meal === "Non-Vegetarian") {
        console.log('Non-Vegetarian');
        console.log($(this).data('i'));
        console.log(nonVegPlan[$(this).data('i')]);
        plan.selected_plan = nonVegPlan[$(this).data('i')];
        plan.selected_plan.price = plan.selected_plan.soup_cost * plan.selected_plan.days;
        plan.price = plan.selected_plan.price
    }

    //Set meal selection to lunch only
    plan.meals = ["Soup-Lunch"];
    plan.discount_price = parseInt(plan.price * (discount[plan.meals.length]));
    plan.discounted_price = plan.price - plan.discount_price;
    $("#soup-lunch").prop("checked", true);
    $("#salad-lunch").prop("checked", false);
    $("#soup-dinner").prop("checked", false);
    $("#salad-dinner").prop("checked", false);

    $("#s_plan_name").text(plan.selected_plan.name);
    $("#s_plan_price").text(plan.selected_plan.price);

    priceDisplay();
});

function setPlan(plan_name, plan_price, days, id, soup_cost, salad_cost) {
    plan.selected_plan = { name: plan_name, price: plan_price, days: days, soup_cost: soup_cost, salad_cost: salad_cost };
    $(`#${id}`).css('background-color', 'rgb(117 224 87 / 55%)');
    for (let i = 0; i < subPlan.length; i++) {
        if (subPlan[i] != id) {
            $(`#${subPlan[i]}`).css('background-color', '');
        }
    }
    showPlanDetails();
    console.log(plan);
    // setMeal("Vegetarian", "vegita");
    plan.price = plan_price;
    plan.meals = ["Soup-lunch"];
    plan.discount_price = parseInt(plan.price * (discount[plan.meals.length]));
    plan.discounted_price = plan.price - plan.discount_price;
    $("#soup-lunch").val(soup_cost);
    $("#salad-lunch").val(salad_cost);
    $("#soup-dinner").val(soup_cost);
    $("#salad-dinner").val(salad_cost);

    $("#soup-lunch").prop("checked", true);
    $("#salad-lunch").prop("checked", false);
    $("#soup-dinner").prop("checked", false);
    $("#salad-dinner").prop("checked", false);
}

function setAddOns() {
    plan.add_ons = $("#addons option:selected").text();
    plan.addons = $("#addons").val();
    $("#s_plan_addons").text(plan.add_ons);
    priceDisplay();
}


//Currently not in use
// function showPlanDetails() {
//     let amt = parseFloat(`plan.selected_plan.price`);
//     if (plan.optionalItems.length > 0) {
//         amt = amt + ((29 * parseInt(plan.selected_plan.days)) * plan.optionalItems.length);
//     }
//     amt += fullMealcost * parseInt(plan.selected_plan.days);
//     $('#s_plan_name').val(plan.selected_plan.name);
//     $('#s_plan_price').val(`₹ ${plan.selected_plan.price}`);
//     $('#s_plan_addons').val(`₹ ${(29 * parseInt(plan.selected_plan.days)) * plan.optionalItems.length}`);
//     $('#s_plan_fm').val(`₹ ${fullMealcost * parseInt(plan.selected_plan.days)}`);
//     $('#s_plan_days').val(`${plan.selected_plan.days} Days`);
//     $('#total_amount').text(`₹ ${amt}`);
// }

// function setTimeslot() {
//     plan.timeslot = $('#timeslot').val();
//     console.log(plan);
// }

// function applyCoupon() {
//     let coupon = $('#coupon').val();
//     if (coupon == '') {
//         $('#coupon-error').addClass('text-danger');
//         $('#coupon-error').text('Please enter coupon code');
//     }
//     else {
//         coupon = coupon.toUpperCase();
//         console.log(coupons[coupon]);
//         if (plan.selected_plan.coupon != null && plan.selected_plan.coupon == coupon) {
//             $('#coupon-error').text('Coupon already applied');
//         } else if (coupons[coupon] != undefined) {

//             $('#coupon-error').removeClass('text-danger');
//             // $('#coupon-error').text('Coupon applied successfully');
//             $('#coupon-error').addClass('text-success');
//             if (coupon == 'SOUPERSTAR') {
//                 let discount = parseInt(plan.selected_plan.price) * (coupons[coupon] / 100);
//                 coupons[coupon] = discount <= 600 ? discount : 600;
//             } else if (coupon == 'SOUPX50') {
//                 let discount = parseInt(plan.selected_plan.price) * (coupons[coupon] / 100);
//                 coupons[coupon] = discount;
//             }
//             $('#coupon-error').text(`You saved ₹ ${coupons[coupon]} !`);
//             plan.selected_plan.coupon = coupon;
//             plan.selected_plan.discount = coupons[coupon];
//             plan.selected_plan.price = parseInt(plan.selected_plan.price) - coupons[coupon];
//             // $('#s_plan_price').val(plan.selected_plan.price);
//             $('#coupon').prop('readonly', true);
//             showPlanDetails();
//             console.log(plan);
//         }
//         else {
//             $('#coupon-error').removeClass('text-success');
//             $('#coupon-error').text('Invalid coupon code');
//             $('#coupon-error').addClass('text-danger');
//         }
//     }
// }

/* =================== Razorpay Checkout ==================== */

function payment(id) {
    var amt = parseFloat(plan.total);
    if (plan.optionalItems.length > 0) {
        amt = amt + ((29 * parseInt(plan.selected_plan.days)) * plan.optionalItems.length);
    }
    amt += fullMealcost * parseInt(plan.selected_plan.days);
    $.ajax({
        url: './api/payment.php',
        method: 'POST',
        data: { action: 'initiateOrder', amount: amt, id: id },
        success: function (response) {
            response = JSON.parse(response);
            console.log(response);
            // if(response.success){
            var options = {
                "key": response.key_id, // Enter the Key ID generated from the Dashboard
                "amount": response.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise or INR 500.
                "currency": "INR",
                "order_id": response.gateway_txn_id,//This is a sample Order ID. Create an Order using Orders API. (https://razorpay.com/docs/payment-gateway/orders/integration/#step-1-create-an-order). Refer the Checkout form table given below
                "handler": function (response) {
                    console.log(response);
                    $.ajax({
                        url: './api/payment.php',
                        method: 'POST',
                        data: { paymentData: response, action: 'confirmOrder', amount: amt, id: id },
                        success: function (response) {
                            console.log(response);
                            // response = JSON.parse(response);
                            if (response == 'success') {
                                alert("Payemnt Successfull !!");
                                location.reload(true);
                            } else {
                                alert("Payment Failed !!");
                            }
                        }
                    });
                },
                "prefill": {
                    "name": $('#name').val(),
                    "email": $('#email').val(),
                    "contact": '+91' + $('#phone').val()
                },
            };
            console.log(options);
            var rzp1 = new window.Razorpay(options);
            rzp1.open();
            $('#loader_form').css('display', '');
            // }

        }
    });
}


//Loads preview of selected data on Checkout & Pay

// function loadPreview() {
//     plan.total = plan.discounted_price;

//     $("#s_name").text(plan.name);
//     $("#s_phone").text(plan.phone);
//     $("#s_address").text(plan.address);
//     $("#s_city").text(plan.city);
//     $("#s_pincode").text(plan.pincode);
//     $("#s_prefs").text(plan.meals);
//     $("#s_plan_name").text(plan.selected_plan.name);
//     $("#s_plan_price").text(plan.selected_plan.price);
//     document.getElementById("s_days").innerHTML = plan.days
//     $("d_addons").text($("#addons option:selected").text());
//     // document.getElementById("s_plan_addons").innerHTML = plan.add_ons;
//     document.getElementById("s_gender").innerHTML = plan.sex;
//     $("#s_meals").prop("innerHTML", plan.meals);
//     document.getElementById("d_plan_price").innerHTML = plan.total;
//     plan.total += plan.add_ons;
//     $("addons").text($("#addons").val());

//     document.getElementById("d_gst").innerHTML = (5 * plan.total) / 100;
//     plan.total += (5 * plan.total) / 100;
//     document.getElementById("d_total_amount").innerHTML = plan.total;


// }

document.getElementById("next-meal").addEventListener("click", function (e) {
    e.preventDefault();
    if (plan.meal != null && plan.selected_plan.days != 0) {
        setActiveStep(2);
        setActivePanel(2);
    }
    else if (plan.meal == null) {
        console.log("Please select a meal type");
    }
    else {
        console.log("Please select the number of days for the Custom Plan");
    }
});

document.getElementById("back-meal").addEventListener("click", function (e) {
    e.preventDefault();
    setActiveStep(0);
    setActivePanel(0);
});

document.getElementById("next-personal").addEventListener("click", function (e) {
    e.preventDefault();
    if (plan.name != null && plan.phone != null && plan.address != null && plan.pincode != null && plan.city != null && plan.age != null && plan.sex != null && plan.weight != null && plan.height != null && days.length != 0 && plan.weight != '' && plan.height != '' && plan.age != '') {
        setActiveStep(3);
        setActivePanel(3);
    }
    else {
        console.log("Please fill all the details");
    }
});

document.getElementById("back-personal").addEventListener("click", function (e) {
    e.preventDefault();
    setActiveStep(1);
    setActivePanel(1);
});

document.getElementById("back-sub").addEventListener("click", function (e) {
    e.preventDefault();
    setActiveStep(2);
    setActivePanel(2);
});

document.getElementById("paylater").addEventListener("click", function (e) {
    e.preventDefault();
    subData = {
        razorpay_order_id: null,
        razorpay_payment_id: null,
        razorpay_signature: null,
        name: plan.name,
        phone: plan.phone,
        sex: plan.sex,
        age: plan.age,
        weight: plan.weight,
        height: plan.height,
        goal: plan.goal,
        days: plan.days,
        add_ons: plan.add_ons,
        meals: plan.meals,
        preference: plan.meal,
        address: plan.address,
        city: plan.city,
        pincode: plan.pincode,
        amt: plan.total,
        payLater: 'true'
    }
    fetch('http://localhost:3504/api/payLater', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(subData)
    })
        .then(response => response.json())
        .then(data => {
            alert(JSON.stringify(data));
            console.log('Response:', data);
        })
        .catch(error => {
            console.error('Error:', error);
        });

})

//Event handler for submit & pay
document.getElementById("subnpay").addEventListener("click", function (e) {
    window.removeEventListener('beforeunload', unloadHandler);

    e.preventDefault();
    const payment_amount = plan.total;
    var url = '/api/payment/order';
    var params = {
        amount: payment_amount * 100,
        currency: "INR",
        receipt: "su001",
        payment_capture: '1'
    };

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function (res) {
        if (xmlHttp.readyState === 4) {
            res = JSON.parse(xmlHttp.responseText);
            const order_id = res.sub.id;
            razorpayPayment(order_id);
            // console.log(order_id);
        }
    }
    xmlHttp.open("POST", url, true); // false for synchronous request
    xmlHttp.setRequestHeader("Content-type", "application/json");
    xmlHttp.send(JSON.stringify(params));

});

//Takes the order id and initiates the payment
function razorpayPayment(order_id) {
    console.log("Payment in progress");
    let payment_id, signature;
    var options = {
        "key": "rzp_test_4wIWvYrxDrtp8s",  //Enter your razorpay key
        "currency": "INR",
        "name": "Razor Tutorial",
        "description": "Razor Test Transaction",
        "image": "https://previews.123rf.com/images/subhanbaghirov/subhanbaghirov1605/subhanbaghirov160500087/56875269-vector-light-bulb-icon-with-concept-of-idea-brainstorming-idea-illustration-.jpg",
        "order_id": order_id,
        "handler": function (response) {
            payment_id = response.razorpay_payment_id;
            signature = response.razorpay_signature;
            verification(order_id, payment_id, signature);

        },
        "theme": {
            "color": "#227254"
        }
    };
    var rzp1 = new Razorpay(options);
    rzp1.open();
}

//Verifying successful payment
function verification(order_id, payment_id, signature) {
    // console.log(order_id, payment_id, signature);
    var url = '/api/payment/verify';
    var params = {
        razorpay_order_id: order_id,
        razorpay_payment_id: payment_id,
        razorpay_signature: signature,
        name: plan.name,
        phone: plan.phone,
        sex: plan.sex,
        age: plan.age,
        weight: plan.weight,
        height: plan.height,
        goal: plan.goal,
        days: plan.days,
        add_ons: plan.add_ons,
        meals: plan.meals,
        preference: plan.meal,
        address: plan.address,
        city: plan.city,
        pincode: plan.pincode,
        amt: plan.total,
        payLater: 'false'
    };
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function (res) {
        if (xmlHttp.readyState === 4) {
            console.log(xmlHttp.responseText);
            alert(xmlHttp.responseText);
        }
    }
    xmlHttp.open("POST", url, true); // false for synchronous request
    xmlHttp.setRequestHeader("Content-type", "application/json");
    xmlHttp.send(JSON.stringify(params));
}

function createLead() {
    const leadData = { name: plan.name, phone: plan.phone };

    fetch('http://localhost:3504/api/subLeads', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(leadData)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Response:', data);
        })
        .catch(error => {
            console.error('Error:', error);
        });

}

function unloadHandler(event) {
    // Custom message to display
    const confirmationMessage = 'Are you sure you want to miss out on your training plan?';

    if (plan.phone !== null && plan.phone !== '' && plan.phone != undefined) {
        alert(confirmationMessage);
        createLead();
    }

    // Modern browsers require the event.returnValue assignment
    event.returnValue = confirmationMessage;

    // Returning the message is optional for some browsers, but can be used to customize the confirmation dialog
    return confirmationMessage;
}

// window.addEventListener('beforeunload', unloadHandler);

document.getElementById("link-pay-later").addEventListener('click', (e) => {
    e.preventDefault();
    const payLater = document.getElementById("paylater");
    payLater.classList.remove("hidden");
})

$(window).on("load", function () {
    $(".pref-card").each(function () {
        if ($(this).data("pref") === "Vegetarian") {
            $(this).click();
        }
    });

    $("#vegClick").click();

});

init();
showPlanDetails();