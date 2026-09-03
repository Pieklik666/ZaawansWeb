export default async function generujLayout(layout, res, data, title = '') {
	try {
		console.log('	[generujLayout]	layout:', layout);
		res.render(layout, data, (error, content) => {
			if (error) {
				console.log('	[generujLayout]	błąd renderowania "' + layout + '":', error);
				throw error;
			}

			try {
				// console.log('		rendering "layout/index"');
				res.render(
					'layout/index',
					{
						title: title,
						// szkolySelect: szkolySelect,
						// selectedSchoolId: res.req.session.selectedSchoolId,
						// selectedSchoolName: res.req.session.selectedSchoolName,
						// flashError: res.req.flash('error').length ? `<div class="error">${res.req.flash('error')}</div>` : '',
						// flashSuccess: res.req.flash('success').length ? `<div class="success">${res.req.flash('success')}</div>` : '',
						content: content,
					},
					(error, html) => {
						// console.log('	rendered layout/index');
						if (error) {
							console.log('	błąd renderowania layout/index:', error);
							throw error;
						}
						// console.log('	sending ' + html);
						res.write(html);
						res.end();
					}
				);
			} catch (error) {
				console.log('	[generujLayout]	błąd renderowania "' + layout + '":', error);
			}
		});
	} catch (error) {
		console.log('	[generujLayout]	błąd renderowania "' + layout + '":', error);
	}
}
