const form = document.querySelector('form');

const input = form.querySelector('input');
const btn = form.querySelector('button');

form.addEventListener('submit', async (e) => {
	e.preventDefault();

	const value = input.value;

	if (!value) return;

	// TODO: check url formatting

	Swal.fire({
		title: 'Creating your awesome short...',

		showConfirmButton: false,

		didOpen: async () => {
			await axios
				.post('/api/shorts/', {
					url: value,
				})
				.then(({ data }) => {
					const id = data;

					const link = `${window.location.host}/${id}`;

					Swal.fire({
						title: 'Short created!',
						html: `Your short link is: <a href="/${id}" target="_blank">${link}</a>`,
						icon: 'success',

						allowOutsideClick: false,
						allowEscapeKey: false,
						allowEnterKey: false,

						showLoaderOnConfirm: true,
						preConfirm: (login) => {
							return fetch(`//api.github.com/users/${login}`)
								.then((response) => {
									if (!response.ok) {
										throw new Error(response.statusText);
									}
									return response.json();
								})
								.catch((error) => {
									Swal.showValidationMessage(`Request failed: ${error}`);
								});
						},

						showCancelButton: true,
						confirmButtonText: 'Copy to clipboard',
						cancelButtonText: `Close`,
					}).then(({ isConfirmed: res }) => {
						if (res) window.navigator.clipboard.writeText(link);

						input.value = '';
					});
				})
				.catch(({ response }) => {
					const { data, status } = response;
					const { error: errorMessage } = data;

					console.log({
						status,
						errorMessage,
					});

					Swal.fire({
						title: 'Error',
						text: errorMessage,
						icon: 'error',
					});
				});
		},
	});
});
