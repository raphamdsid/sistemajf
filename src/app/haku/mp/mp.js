const mp = new MercadoPago('TEST-5d21a6ef-6ec2-4520-9795-ed355329c1be');
  // Add step #3
  // Step #3
  const cardForm = mp.cardForm({
    amount: "100.5",
    autoMount: true,
    form: {
      id: "form-checkout",
      cardholderName: {
        id: "form-checkout__cardholderName",
        placeholder: "Titular do cartão",
      },
      cardholderEmail: {
        id: "form-checkout__cardholderEmail",
        placeholder: "E-mail",
      },
      cardNumber: {
        id: "form-checkout__cardNumber",
        placeholder: "Número do cartão",
      },
      cardExpirationDate: {
        id: "form-checkout__cardExpirationDate",
        placeholder: "Data de vencimento (MM/YYYY)",
      },
      securityCode: {
        id: "form-checkout__securityCode",
        placeholder: "Código de segurança",
      },
      installments: {
        id: "form-checkout__installments",
        placeholder: "Parcelas",
      },
      identificationType: {
        id: "form-checkout__identificationType",
        placeholder: "Tipo de documento",
      },
      identificationNumber: {
        id: "form-checkout__identificationNumber",
        placeholder: "Número do documento",
      },
      issuer: {
        id: "form-checkout__issuer",
        placeholder: "Banco emissor",
      },
    },
    callbacks: {
      onFormMounted: error => {
        if (error) return console.warn("Form Mounted handling error: ", error);
        console.log("Form mounted");
      },
      onSubmit: event => {
        event.preventDefault();

        const {
          paymentMethodId: payment_method_id,
          issuerId: issuer_id,
          cardholderEmail: email,
          amount,
          token,
          installments,
          identificationNumber,
          identificationType,
        } = cardForm.getCardFormData();
        
        fetch("http://192.168.1.200/jfapi/teste_mp/process_payment.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            token,
            issuer_id,
            payment_method_id,
            transaction_amount: Number(amount),
            installments: Number(installments),
            description: "Descrição do produto",
            payer: {
              email,
              identification: {
                type: identificationType,
                number: identificationNumber,
              },
            },
          }),
        });
      },
      onFetching: (resource) => {
        console.log("Fetching resource: ", resource);

        // Animate progress bar
        const progressBar = document.querySelector(".progress-bar");
        progressBar.removeAttribute("value");

        return () => {
          progressBar.setAttribute("value", "0");
        };
      }
    },
  });