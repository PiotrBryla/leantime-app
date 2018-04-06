
    console.log("function fire");
            $("#newEmployeeName").text(firstName + " " + lastName);
            $("#newEmployeeDepartament").text(departament);

            var typeNumber = 4;
            var errorCorrectionLevel = 'L';
            var qr = qrcode(typeNumber, errorCorrectionLevel);
            qr.addData(eid)
            qr.make()
            document.getElementById('employeeQR').innerHTML = qr.createSvgTag();
