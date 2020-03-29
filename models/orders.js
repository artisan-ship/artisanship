var mongoose = require('mongoose');

// create new random product
var OrdersSchema = new mongoose.Schema({
	orders: [
		{
			id: {
				type: 'Number'
			},
			email: {
				type: 'String'
			},
			closed_at: {
				type: 'Mixed'
			},
			created_at: {
				type: 'Date'
			},
			updated_at: {
				type: 'Date'
			},
			number: {
				type: 'Number'
			},
			note: {
				type: 'Mixed'
			},
			token: {
				type: 'String'
			},
			gateway: {
				type: 'String'
			},
			test: {
				type: 'Boolean'
			},
			total_price: {
				type: 'String'
			},
			subtotal_price: {
				type: 'String'
			},
			total_weight: {
				type: 'Number'
			},
			total_tax: {
				type: 'String'
			},
			taxes_included: {
				type: 'Boolean'
			},
			currency: {
				type: 'String'
			},
			financial_status: {
				type: 'String'
			},
			confirmed: {
				type: 'Boolean'
			},
			total_discounts: {
				type: 'String'
			},
			total_line_items_price: {
				type: 'String'
			},
			cart_token: {
				type: 'String'
			},
			buyer_accepts_marketing: {
				type: 'Boolean'
			},
			name: {
				type: 'Date'
			},
			referring_site: {
				type: 'String'
			},
			landing_site: {
				type: 'String'
			},
			cancelled_at: {
				type: 'Mixed'
			},
			cancel_reason: {
				type: 'Mixed'
			},
			total_price_usd: {
				type: 'String'
			},
			checkout_token: {
				type: 'String'
			},
			reference: {
				type: 'String'
			},
			user_id: {
				type: 'Mixed'
			},
			location_id: {
				type: 'Mixed'
			},
			source_identifier: {
				type: 'String'
			},
			source_url: {
				type: 'Mixed'
			},
			processed_at: {
				type: 'Date'
			},
			device_id: {
				type: 'Mixed'
			},
			phone: {
				type: 'String'
			},
			customer_locale: {
				type: 'Mixed'
			},
			app_id: {
				type: 'Mixed'
			},
			browser_ip: {
				type: 'String'
			},
			landing_site_ref: {
				type: 'String'
			},
			order_number: {
				type: 'Number'
			},
			discount_applications: {
				type: ['Mixed']
			},
			discount_codes: {
				type: ['Mixed']
			},
			note_attributes: {
				type: ['Mixed']
			},
			payment_gateway_names: {
				type: ['String']
			},
			processing_method: {
				type: 'String'
			},
			checkout_id: {
				type: 'Number'
			},
			source_name: {
				type: 'String'
			},
			fulfillment_status: {
				type: 'Mixed'
			},
			tax_lines: {
				type: ['Mixed']
			},
			tags: {
				type: 'String'
			},
			contact_email: {
				type: 'String'
			},
			order_status_url: {
				type: 'String'
			},
			presentment_currency: {
				type: 'String'
			},
			total_line_items_price_set: {
				shop_money: {
					amount: {
						type: 'String'
					},
					currency_code: {
						type: 'String'
					}
				},
				presentment_money: {
					amount: {
						type: 'String'
					},
					currency_code: {
						type: 'String'
					}
				}
			},
			total_discounts_set: {
				shop_money: {
					amount: {
						type: 'String'
					},
					currency_code: {
						type: 'String'
					}
				},
				presentment_money: {
					amount: {
						type: 'String'
					},
					currency_code: {
						type: 'String'
					}
				}
			},
			total_shipping_price_set: {
				shop_money: {
					amount: {
						type: 'String'
					},
					currency_code: {
						type: 'String'
					}
				},
				presentment_money: {
					amount: {
						type: 'String'
					},
					currency_code: {
						type: 'String'
					}
				}
			},
			subtotal_price_set: {
				shop_money: {
					amount: {
						type: 'String'
					},
					currency_code: {
						type: 'String'
					}
				},
				presentment_money: {
					amount: {
						type: 'String'
					},
					currency_code: {
						type: 'String'
					}
				}
			},
			total_price_set: {
				shop_money: {
					amount: {
						type: 'String'
					},
					currency_code: {
						type: 'String'
					}
				},
				presentment_money: {
					amount: {
						type: 'String'
					},
					currency_code: {
						type: 'String'
					}
				}
			},
			total_tax_set: {
				shop_money: {
					amount: {
						type: 'String'
					},
					currency_code: {
						type: 'String'
					}
				},
				presentment_money: {
					amount: {
						type: 'String'
					},
					currency_code: {
						type: 'String'
					}
				}
			},
			admin_graphql_api_id: {
				type: 'String'
			},
			shipping_lines: {
				type: ['Mixed']
			},
			billing_address: {
				first_name: {
					type: 'String'
				},
				address1: {
					type: 'Date'
				},
				phone: {
					type: 'String'
				},
				city: {
					type: 'String'
				},
				zip: {
					type: 'Date'
				},
				province: {
					type: 'String'
				},
				country: {
					type: 'String'
				},
				last_name: {
					type: 'String'
				},
				address2: {
					type: 'String'
				},
				company: {
					type: 'Mixed'
				},
				latitude: {
					type: 'Number'
				},
				longitude: {
					type: 'Number'
				},
				name: {
					type: 'String'
				},
				country_code: {
					type: 'String'
				},
				province_code: {
					type: 'String'
				}
			},
			shipping_address: {
				first_name: {
					type: 'String'
				},
				address1: {
					type: 'Date'
				},
				phone: {
					type: 'String'
				},
				city: {
					type: 'String'
				},
				zip: {
					type: 'Date'
				},
				province: {
					type: 'String'
				},
				country: {
					type: 'String'
				},
				last_name: {
					type: 'String'
				},
				address2: {
					type: 'String'
				},
				company: {
					type: 'Mixed'
				},
				latitude: {
					type: 'Number'
				},
				longitude: {
					type: 'Number'
				},
				name: {
					type: 'String'
				},
				country_code: {
					type: 'String'
				},
				province_code: {
					type: 'String'
				}
			},
			client_details: {
				browser_ip: {
					type: 'String'
				},
				accept_language: {
					type: 'Mixed'
				},
				user_agent: {
					type: 'Mixed'
				},
				session_hash: {
					type: 'Mixed'
				},
				browser_width: {
					type: 'Mixed'
				},
				browser_height: {
					type: 'Mixed'
				}
			},
			payment_details: {
				credit_card_bin: {
					type: 'Mixed'
				},
				avs_result_code: {
					type: 'Mixed'
				},
				cvv_result_code: {
					type: 'Mixed'
				},
				credit_card_number: {
					type: 'Date'
				},
				credit_card_company: {
					type: 'String'
				}
			},
			customer: {
				id: {
					type: 'Number'
				},
				email: {
					type: 'String'
				},
				accepts_marketing: {
					type: 'Boolean'
				},
				created_at: {
					type: 'Date'
				},
				updated_at: {
					type: 'Date'
				},
				first_name: {
					type: 'String'
				},
				last_name: {
					type: 'String'
				},
				orders_count: {
					type: 'Number'
				},
				state: {
					type: 'String'
				},
				total_spent: {
					type: 'String'
				},
				last_order_id: {
					type: 'Number'
				},
				note: {
					type: 'Mixed'
				},
				verified_email: {
					type: 'Boolean'
				},
				multipass_identifier: {
					type: 'Mixed'
				},
				tax_exempt: {
					type: 'Boolean'
				},
				phone: {
					type: 'Mixed'
				},
				tags: {
					type: 'String'
				},
				last_order_name: {
					type: 'Date'
				},
				currency: {
					type: 'String'
				},
				accepts_marketing_updated_at: {
					type: 'Date'
				},
				marketing_opt_in_level: {
					type: 'Mixed'
				},
				tax_exemptions: {
					type: 'Array'
				},
				admin_graphql_api_id: {
					type: 'String'
				},
				default_address: {
					id: {
						type: 'Number'
					},
					customer_id: {
						type: 'Number'
					},
					first_name: {
						type: 'Mixed'
					},
					last_name: {
						type: 'Mixed'
					},
					company: {
						type: 'Mixed'
					},
					address1: {
						type: 'Date'
					},
					address2: {
						type: 'String'
					},
					city: {
						type: 'String'
					},
					province: {
						type: 'String'
					},
					country: {
						type: 'String'
					},
					zip: {
						type: 'Date'
					},
					phone: {
						type: 'String'
					},
					name: {
						type: 'String'
					},
					province_code: {
						type: 'String'
					},
					country_code: {
						type: 'String'
					},
					country_name: {
						type: 'String'
					},
					default: {
						type: 'Boolean'
					}
				}
			},
			line_items: {
				type: ['Mixed']
			}
		}
	]
});

module.exports = mongoose.model('Order', OrdersSchema);