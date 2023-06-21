async function getSubscription() {
    try {
        const response = await fetch("http://localhost:3504/api/subscription/customers");
        const data = await response.json();
        return data;
    } catch (err) {
        console.error("Error fetching subscription:", err);
        throw err;
    }
}

async function handleReadMore(e){
    $("#myModal").css("display", "block");
    const response = await getSubscription();
    const i = $(e.target).data("i");
    const data = response[i];
    $("#modal-title").text(data.name)
    $("#s_name").text(data.name);
    $("#s_phone").text(data.phone);
    $("#s_address").text(data.address);
    $("#s_city").text(data.city);
    $("#s_pincode").text(data.pincode);
    $("#s_goal").text(data.goal);
    $("#s_gender").text(data.sex);
    $("#s_prefs").text(data.preference);
    // $("#s_plan_name").text(data.)
    $("#s_days").text(data.days);
}

function closeModal() {
    $("#myModal").css("display", "none");
}

async function createTable() {
    const data = await getSubscription();
    console.log(data);

    for (let i = 0; i < data.length; i++) {
        // Create the <tr> element
        var tableRow = $('<tr>');

        // Create the <td> elements and their contents
        var idCell = $('<td>').addClass('border-bottom-0').append($('<h6>').addClass('fw-semibold mb-0').attr('id', 'id').text(`${i}`));
        var nameCell = $('<td>').addClass('border-bottom-0').append($('<h6>').addClass('fw-semibold mb-1').attr('id', 'name').text(`${data[i].name}`));
        var phoneCell = $('<td>').addClass('border-bottom-0').append($('<p>').addClass('mb-0 fw-normal').attr('id', 'phone').text(`${data[i].phone}`));
        var badgeCell = $('<td>').addClass('border-bottom-0').append($('<div>').addClass('d-flex align-items-center gap-2').append($('<span>').addClass('badge bg-primary rounded-3 fw-semibold').attr('id', 'sex').text(`${data[i].sex}`)));
        // var ageCell = $('<td>').addClass('border-bottom-0').append($('<h6>').addClass('fw-semibold mb-0 fs-4').attr('id', 'age').text(`${data[i].age}`));
        var amountCell = $('<td>').addClass('border-bottom-0').append($('<h6>').addClass('fw-semibold mb-0 fs-4').attr('id', 'amount').text(`${data[i].amt}`));
        var paymentIdCell = $('<td>').addClass('border-bottom-0').append($('<h6>').addClass('fw-semibold mb-0 fs-4').attr('id', 'payment_id').text(`${data[i].razorpay_payment_id}`));
        var payLaterCell = $('<td>').addClass('border-bottom-0').append($('<h6>').addClass('fw-semibold mb-0 fs-4').attr('id', 'payLater').text(`${data[i].payLater}`));
        var readMoreCell = $('<td>').addClass('border-bottom-0').append($('<h6>').addClass('fw-semibold mb-0 fs-4 read-more').attr('id', 'payLater').text(`Read More`).attr('data-i',i).attr('onclick','handleReadMore(event)'));
        // var readMoreCell = $('<td>').addClass('border-bottom-0').append($('<h6>').addClass('fw-semibold mb-0 fs-4').attr('id','readMore').attr("data-i"),i).text("Read More");
        // Append the <td> elements to the <tr> element
        tableRow.append(idCell, nameCell, phoneCell, badgeCell,amountCell, paymentIdCell,payLaterCell,readMoreCell);

        // Append the <tr> element to the <tbody> element
        $('.loader').css('display', 'none');
        $('#sub-table').removeClass('hidden');
        $('#sub-body').append(tableRow);

    }
}

createTable();