const { APIError } = require("../../utils/error/app-errors");
const { CustomerModel, AddressModel } = require("../models");

//Dealing with data base operations
class CustomerRepository {
  async CreateCustomer({ email, password, phone, salt }) {
    const customer = new CustomerModel({
      email,
      password,
      salt,
      phone,
      address: [],
    });

    const customerResult = await customer.save();
    return customerResult;
  }

  async CreateAddress({ _id, street, postalCode, city, country }) {
    const profile = await CustomerModel.findById(_id);

    if (profile) {
      const newAddress = new AddressModel({
        street,
        postalCode,
        city,
        country,
      });

      await newAddress.save();

      profile.address.push(newAddress);
    }

    return await profile.save();
  }

  async FindCustomer({ email }) {
    const existingCustomer = await CustomerModel.findOne({ email: email });
    return existingCustomer;
  }

  async FindCustomerById({ id }) {
    const existingCustomer = await CustomerModel.findById(id).populate(
      "address"
    );
    return existingCustomer;
  }

  async DeleteCustomerById(id) {
    return CustomerModel.findByIdAndDelete(id);
  }
}

module.exports = CustomerRepository;
