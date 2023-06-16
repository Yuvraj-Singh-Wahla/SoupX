async function getSubscription() {
    try {
        const response = await fetch("http://localhost:3504/api/explore/leads");
        const data = await response.json();
        return data;
    } catch (err) {
        console.error("Error fetching subscription:", err);
        throw err;
    }
}

async function createTable() {
    const data = await getSubscription();
    console.log(data);

    for (let i = 0; i < data.length; i++) {
        // Create the <tr> element
        var tableRow = $('<tr>');

        // Create the <td> elements and their contents
        var idCell = $('<td>').addClass('border-bottom-0').append($('<h6>').addClass('fw-semibold mb-0').attr('id', 'id').text(`${data[i].id}`));
        var phoneCell = $('<td>').addClass('border-bottom-0').append($('<h6>').addClass('fw-semibold mb-1').attr('id', 'phone').text(`${data[i].phone}`));
        var verificationCell = $('<td>').addClass('border-bottom-0').append($('<p>').addClass('mb-0 fw-normal').attr('id', 'verification').text(`${data[i].verification}`));

        // Append the <td> elements to the <tr> element
        tableRow.append(idCell, phoneCell, verificationCell);

        // Append the <tr> element to the <tbody> element
        $('.loader').css('display', 'none');
        $('table').removeClass('hidden');
        $('tbody').append(tableRow);

    }
}

createTable();