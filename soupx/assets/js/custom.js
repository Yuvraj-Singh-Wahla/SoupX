var plan = {};
var days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
plan.lunch = ['Soup', 'Salad'];
plan.dinner = ['Soup', 'Salad'];
var goalIds = ['looseW', 'healthyEat', 'muscleG', 'detox', 'lightD', 'notS', 'vegita', 'nonvegita'];
var optionalItemIds = ['opt1', 'opt2', 'opt3'];
var prefIds = ['veg', 'nonVeg', 'vegan', 'egg'];
var allergenIds = ['noAllergen', 'nutFree', 'glutenFree'];
var subPlan = ['1stp', '2ndp', '3rdp', '4thp', '5thp', '6thp'];
var salad_cost = 57;
var soup_cost = 78;
var fullMealcost = 0
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
plan.fullMeal = 'No';
plan.preference = [];
plan.optionalItems = [];
plan.selected_plan = { name: 'Trial 7 Days', price: 1463, days: 7, coupon: null, discount: 0 };
setSchedule();
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
function setLunch(eat) {
    if (plan.lunch.length == 0) {
        plan.lunch.push(eat);
    }
    else {
        if (plan.lunch.includes(eat)) {
            let index = plan.lunch.indexOf(eat);
            plan.lunch.splice(index, 1);
        } else {
            plan.lunch.push(eat);
        }
    }
    console.log(plan.lunch);
}

//Selecting meals for dinner
function setDinner(eat) {
    if (plan.dinner.length == 0) {
        plan.dinner.push(eat);
    }
    else {
        if (plan.dinner.includes(eat)) {
            let index = plan.dinner.indexOf(eat);
            plan.dinner.splice(index, 1);
        } else {
            plan.dinner.push(eat);
        }
    }
    console.log(plan.dinner);
}

function setGender(gender, id, _id) {
    plan.sex = gender;
    $(`#${id}`).parent().css('background-color', 'rgb(117 224 87 / 55%)');
    $(`#${id}`).parent().css('color', 'white');
    $(`#${_id}`).parent().css('background-color', '');
    $(`#${_id}`).parent().css('color', '');
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
}

function setPhone() {
    plan.phone = $('#phone').val();
}

function setAddress() {
    let a1 = $("#address_1").val();
    let a2 = $("#address_2").val();
    let landmark = $("#landmark").val();
    plan.pincode = $("#pincode").val();
    plan.city = $("#city").val();
    plan.address = a1 + ", " + a2 + ", Landmark: " + landmark;
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
function setMeal(meal, id) {
    plan.meal = meal;
    $(`#${id}`).parent().parent().css('background-color', 'rgb(117 224 87 / 55%)');
    if (id == 'vegita') {
        $(`#nonvegita`).parent().parent().css('background-color', '');
    }
    if (id == 'nonvegita') {
        $(`#vegita`).parent().parent().css('background-color', '');
    }
}

function setDays(day) {
    // days.push(day);
    if (days.length == 0) {
        days.push(day);
        // $(`#${id}`).css('background-color', '#c5c50c');
    } else {
        if (days.includes(day)) {
            let index = days.indexOf(day);
            days.splice(index, 1);
            // $(`#${id}`).css('background-color', 'rgb(199, 193, 193)');
        } else {
            days.push(day);
            // $(`#${id}`).css('background-color', '#c5c50c');
        }
    }
    console.log(days);
}
function setSchedule() {
    if (days.length == 0) {
        alert('Please select atleast one day');
        return false;
    } else {
        plan.days = days;
        return true;
    }
}
function setPlan(plan_name, plan_price, days, id) {
    plan.selected_plan = { name: plan_name, price: plan_price, days: days };
    $(`#${id}`).css('background-color', 'rgb(117 224 87 / 55%)');
    for (let i = 0; i < subPlan.length; i++) {
        if (subPlan[i] != id) {
            $(`#${subPlan[i]}`).css('background-color', '');
        }
    }
    showPlanDetails();
    console.log(plan);
}

function setAddOns() {
    plan.add_ons = document.getElementById("addons").selectedOptions[0].innerHTML;

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

function handlePriceChange() {
    let val = 0;
    if (plan.lunch.indexOf('Salad') === -1) {
        val += salad_cost;
    }
    if (plan.lunch.indexOf('Soup') === -1) {
        val += soup_cost;
    }
    if (plan.dinner.indexOf('Soup') === -1) {
        val += soup_cost;
    }
    if (plan.dinner.indexOf('Salad') === -1) {
        val += salad_cost
    }
    return val * plan.selected_plan.days;
}

//Loads preview of selected data on Checkout & Pay
function loadPreview() {
    let cr = handlePriceChange();
    plan.total = parseInt(plan.selected_plan.price);

    console.log(plan);
    document.getElementById('s_name').innerHTML = plan.name;
    document.getElementById("s_phone").innerHTML = plan.phone;
    document.getElementById("s_address").innerHTML = plan.address;
    document.getElementById("s_city").innerHTML = plan.city;
    document.getElementById("s_pincode").innerHTML = plan.pincode;
    document.getElementById("s_goal").innerHTML = plan.goal;
    document.getElementById("s_prefs").innerHTML = plan.meal;
    document.getElementById("s_plan_name").innerHTML = plan.selected_plan.name;
    document.getElementById("s_plan_price").innerHTML = plan.selected_plan.price;
    document.getElementById("s_days").innerHTML = plan.days
    document.getElementById("s_plan_addons").innerHTML = plan.add_ons;
    document.getElementById("s_gender").innerHTML = plan.sex;
    document.getElementById("s_lunch").innerHTML = plan.lunch;
    document.getElementById("s_dinner").innerHTML = plan.dinner;

    document.getElementById("d_plan_price").innerHTML = plan.total;
    plan.total += parseInt(document.getElementById("addons").value);
    document.getElementById("d_addons").innerHTML = (document.getElementById("addons").value);
    if (cr > 0) {
        document.getElementById("crd").classList.remove("hidden");
        document.getElementById("d_costr").innerHTML = "-" + cr;
        plan.total = plan.total - cr;
    }
    else {
        document.getElementById("crd").classList.add("hidden");
    }
    document.getElementById("d_gst").innerHTML = (5 * plan.total) / 100;
    plan.total += (5 * plan.total) / 100;
    document.getElementById("d_total_amount").innerHTML = plan.total;


}

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
        lunch: plan.lunch,
        dinner: plan.dinner,
        address: plan.address,
        city: plan.city,
        pincode: plan.pincode,
        amt: plan.total
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

window.addEventListener('beforeunload', unloadHandler);


init();
showPlanDetails();