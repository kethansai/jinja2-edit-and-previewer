export const examples = [
  {
    name: "Welcome Email",
    template: `<!DOCTYPE html>
<html>
<head><title>Welcome!</title></head>
<body>
  <h1>Hello, {{ name }}!</h1>
  <p>Welcome to <strong>{{ company }}</strong>. We're thrilled to have you on board.</p>

  {% if is_premium %}
  <div style="background: #f0f9ff; padding: 16px; border-radius: 8px; margin: 16px 0;">
    <h2>🌟 Premium Member Benefits</h2>
    <ul>
      {% for feature in premium_features %}
      <li>{{ feature }}</li>
      {% endfor %}
    </ul>
  </div>
  {% else %}
  <p>Upgrade to Premium to unlock exclusive features!</p>
  {% endif %}

  <p>Your account was created on {{ signup_date }}.</p>
  <p>Best regards,<br>The {{ company }} Team</p>
</body>
</html>`,
    context: JSON.stringify(
      {
        name: "Alice",
        company: "Acme Corp",
        is_premium: true,
        premium_features: [
          "Priority support",
          "Advanced analytics",
          "Custom integrations",
          "Unlimited storage",
        ],
        signup_date: "2026-02-22",
      },
      null,
      2,
    ),
  },
  {
    name: "Product Card",
    template: `<div style="font-family: sans-serif; max-width: 320px; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
  <img src="{{ product.image }}" alt="{{ product.name }}" style="width: 100%; height: 200px; object-fit: cover;">
  <div style="padding: 16px;">
    <h2 style="margin: 0 0 8px;">{{ product.name }}</h2>
    <p style="color: #666; font-size: 14px;">{{ product.description | truncate(100) }}</p>

    <div style="display: flex; align-items: center; gap: 8px; margin: 12px 0;">
      {% if product.on_sale %}
      <span style="text-decoration: line-through; color: #999;">\${{ "%.2f" | format(product.original_price) }}</span>
      <span style="color: #e53e3e; font-size: 24px; font-weight: bold;">\${{ "%.2f" | format(product.price) }}</span>
      {% else %}
      <span style="font-size: 24px; font-weight: bold;">\${{ "%.2f" | format(product.price) }}</span>
      {% endif %}
    </div>

    <div style="margin: 8px 0;">
      {% for i in range(5) %}
        {% if i < product.rating %}⭐{% else %}☆{% endif %}
      {% endfor %}
      <span style="color: #999; font-size: 12px;">({{ product.reviews }} reviews)</span>
    </div>

    {% if product.in_stock %}
    <button style="width: 100%; padding: 12px; background: #3182ce; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;">
      Add to Cart
    </button>
    {% else %}
    <button style="width: 100%; padding: 12px; background: #cbd5e0; color: #718096; border: none; border-radius: 8px; cursor: not-allowed; font-size: 16px;">
      Out of Stock
    </button>
    {% endif %}
  </div>
</div>`,
    context: JSON.stringify(
      {
        product: {
          name: "Wireless Headphones",
          description:
            "Premium noise-cancelling wireless headphones with 30-hour battery life and crystal clear audio quality for music lovers and professionals alike.",
          image: "https://picsum.photos/320/200",
          price: 79.99,
          original_price: 129.99,
          on_sale: true,
          rating: 4,
          reviews: 238,
          in_stock: true,
        },
      },
      null,
      2,
    ),
  },
  {
    name: "Invoice Table",
    template: `<div style="font-family: sans-serif; max-width: 600px; margin: auto;">
  <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 32px;">
    <div>
      <h1 style="margin: 0; color: #2d3748;">INVOICE</h1>
      <p style="color: #718096;">#{{ invoice.number }}</p>
    </div>
    <div style="text-align: right;">
      <strong>{{ company.name }}</strong><br>
      {{ company.address }}<br>
      {{ company.email }}
    </div>
  </div>

  <div style="margin-bottom: 24px;">
    <strong>Bill To:</strong><br>
    {{ client.name }}<br>
    {{ client.address }}<br>
    <strong>Date:</strong> {{ invoice.date }}
  </div>

  <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
    <thead>
      <tr style="background: #edf2f7;">
        <th style="padding: 12px; text-align: left; border-bottom: 2px solid #cbd5e0;">Item</th>
        <th style="padding: 12px; text-align: right; border-bottom: 2px solid #cbd5e0;">Qty</th>
        <th style="padding: 12px; text-align: right; border-bottom: 2px solid #cbd5e0;">Price</th>
        <th style="padding: 12px; text-align: right; border-bottom: 2px solid #cbd5e0;">Total</th>
      </tr>
    </thead>
    <tbody>
      {% for item in invoice.items %}
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">{{ item.name }}</td>
        <td style="padding: 12px; text-align: right; border-bottom: 1px solid #e2e8f0;">{{ item.qty }}</td>
        <td style="padding: 12px; text-align: right; border-bottom: 1px solid #e2e8f0;">\${{ "%.2f" | format(item.price) }}</td>
        <td style="padding: 12px; text-align: right; border-bottom: 1px solid #e2e8f0;">\${{ "%.2f" | format(item.qty * item.price) }}</td>
      </tr>
      {% endfor %}
    </tbody>
  </table>

  <div style="text-align: right;">
    <p>Subtotal: <strong>\${{ "%.2f" | format(invoice.items | sum(attribute='total')) }}</strong></p>
    {% if invoice.tax_rate %}
    <p>Tax ({{ invoice.tax_rate }}%): <strong>\${{ "%.2f" | format(subtotal * invoice.tax_rate / 100) }}</strong></p>
    {% endif %}
    <hr>
    <h2 style="color: #2d3748;">Total: \${{ "%.2f" | format(grand_total) }}</h2>
  </div>

  {% if invoice.notes %}
  <div style="margin-top: 32px; padding: 16px; background: #f7fafc; border-radius: 8px;">
    <strong>Notes:</strong>
    <p>{{ invoice.notes }}</p>
  </div>
  {% endif %}
</div>`,
    context: JSON.stringify(
      {
        company: {
          name: "Design Studio LLC",
          address: "123 Creative Ave, New York, NY 10001",
          email: "billing@designstudio.com",
        },
        client: {
          name: "John Smith",
          address: "456 Business Rd, San Francisco, CA 94102",
        },
        invoice: {
          number: "INV-2026-0042",
          date: "2026-02-22",
          items: [
            { name: "Website Redesign", qty: 1, price: 3500.0, total: 3500.0 },
            { name: "Logo Design", qty: 1, price: 800.0, total: 800.0 },
            { name: "SEO Optimization", qty: 3, price: 200.0, total: 600.0 },
            { name: "Content Writing", qty: 5, price: 150.0, total: 750.0 },
          ],
          tax_rate: 8.5,
          notes: "Payment is due within 30 days. Thank you for your business!",
        },
        subtotal: 5650.0,
        grand_total: 6130.25,
      },
      null,
      2,
    ),
  },
  {
    name: "Config File (YAML)",
    template: `# Application Configuration
# Generated on {{ generated_date }}

app:
  name: {{ app.name }}
  version: {{ app.version }}
  debug: {{ app.debug | lower }}

server:
  host: {{ server.host }}
  port: {{ server.port }}
  {% if server.ssl %}
  ssl:
    enabled: true
    cert: {{ server.ssl.cert }}
    key: {{ server.ssl.key }}
  {% endif %}

database:
  engine: {{ database.engine }}
  host: {{ database.host }}
  port: {{ database.port }}
  name: {{ database.name }}
  pool_size: {{ database.pool_size | default(5) }}

logging:
  level: {{ logging.level | default('INFO') | upper }}
  {% if logging.handlers %}
  handlers:
    {% for handler in logging.handlers %}
    - type: {{ handler.type }}
      {% if handler.filename %}
      filename: {{ handler.filename }}
      {% endif %}
      {% if handler.max_bytes %}
      max_bytes: {{ handler.max_bytes | filesizeformat }}
      {% endif %}
    {% endfor %}
  {% endif %}

{% if features %}
features:
  {% for feature, enabled in features | dictsort %}
  {{ feature }}: {{ enabled | lower }}
  {% endfor %}
{% endif %}`,
    context: JSON.stringify(
      {
        generated_date: "2026-02-22T10:30:00Z",
        app: {
          name: "MyWebApp",
          version: "2.1.0",
          debug: false,
        },
        server: {
          host: "0.0.0.0",
          port: 8080,
          ssl: {
            cert: "/etc/ssl/certs/app.crt",
            key: "/etc/ssl/private/app.key",
          },
        },
        database: {
          engine: "postgresql",
          host: "db.example.com",
          port: 5432,
          name: "myapp_production",
          pool_size: 10,
        },
        logging: {
          level: "warning",
          handlers: [
            { type: "console" },
            {
              type: "file",
              filename: "/var/log/myapp.log",
              max_bytes: 10485760,
            },
          ],
        },
        features: {
          dark_mode: true,
          notifications: true,
          beta_features: false,
          analytics: true,
        },
      },
      null,
      2,
    ),
  },
  {
    name: "User Dashboard",
    template: `<div style="font-family: sans-serif; padding: 24px; max-width: 800px;">
  <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 24px;">
    <div style="width: 64px; height: 64px; border-radius: 50%; background: #4299e1; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: bold;">
      {{ user.name[0] | upper }}
    </div>
    <div>
      <h1 style="margin: 0;">{{ user.name }}</h1>
      <p style="margin: 4px 0; color: #718096;">{{ user.role | capitalize }} · Joined {{ user.joined }}</p>
    </div>
  </div>

  <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px;">
    {% for stat in stats %}
    <div style="padding: 20px; background: {{ stat.color }}15; border-radius: 12px; text-align: center;">
      <div style="font-size: 28px; font-weight: bold; color: {{ stat.color }};">{{ stat.value }}</div>
      <div style="color: #718096; font-size: 14px;">{{ stat.label }}</div>
    </div>
    {% endfor %}
  </div>

  <h2>Recent Activity</h2>
  {% if activities %}
  <div style="border-left: 2px solid #e2e8f0; padding-left: 20px;">
    {% for activity in activities %}
    <div style="margin-bottom: 16px; position: relative;">
      <div style="position: absolute; left: -27px; top: 4px; width: 12px; height: 12px; border-radius: 50%; background: {{ activity.color | default('#4299e1') }};"></div>
      <div style="font-weight: 500;">{{ activity.action }}</div>
      <div style="color: #a0aec0; font-size: 13px;">{{ activity.time }}</div>
    </div>
    {% endfor %}
  </div>
  {% else %}
  <p style="color: #a0aec0;">No recent activity.</p>
  {% endif %}
</div>`,
    context: JSON.stringify(
      {
        user: {
          name: "Sarah Johnson",
          role: "administrator",
          joined: "Jan 2025",
        },
        stats: [
          { label: "Projects", value: 12, color: "#4299e1" },
          { label: "Tasks Done", value: 148, color: "#48bb78" },
          { label: "Comments", value: 89, color: "#ed8936" },
        ],
        activities: [
          {
            action: "Deployed v2.1.0 to production",
            time: "2 hours ago",
            color: "#48bb78",
          },
          {
            action: "Merged pull request #42",
            time: "5 hours ago",
            color: "#4299e1",
          },
          {
            action: 'Created new project "Dashboard"',
            time: "Yesterday",
            color: "#ed8936",
          },
          {
            action: "Updated team permissions",
            time: "2 days ago",
            color: "#9f7aea",
          },
        ],
      },
      null,
      2,
    ),
  },
  {
    name: "Blank",
    template: `<h1>Hello, {{ name }}!</h1>
<p>Start editing this template...</p>`,
    context: JSON.stringify(
      {
        name: "World",
      },
      null,
      2,
    ),
  },
  {
    name: "Design Review Notification",
    template: `<div style="display: flex; flex-direction: column; justify-content: center; text-align: left; align-items: center;">
  <div style="border-style: solid; border-width: 1px; border-color: rgb(146, 130, 133); text-align: left;">
    <div class="ve-has-bg" style="display: flex; justify-content: space-between; border-style: solid; border-width: 0px 0px 1px; border-color: rgb(146, 130, 133); --bg-image: url('https://png.pngtree.com/png-clipart/20241216/original/pngtree-simple-banner-for-products-with-a-combination-of-orange-and-maroon-png-image_17950506.png'); --bg-opacity: 0.2;">
      <div style="text-align: center; display: flex; flex-direction: column; justify-content: center; padding-right: 15px; padding-left: 15px; margin: 0px;">
        <b>
          <span style="font-size: 18pt;">
            <font color="#ab377a">
              {{ applicationName }}
            </font>
          </span>
        </b>
      </div>
      <img src="https://png.pngtree.com/png-clipart/20241216/original/pngtree-simple-banner-for-products-with-a-combination-of-orange-and-maroon-png-image_17950506.png" style="width: 40%; height: 68%; clip-path: polygon(23.87% -1.16%, 100% 0%, 100% 100%, 0% 100%);">
    </div>
    <div class="ve-has-bg" style="--bg-image: url('https://png.pngtree.com/png-clipart/20241216/original/pngtree-simple-banner-for-products-with-a-combination-of-orange-and-maroon-png-image_17950506.png'); --bg-opacity: 0.05;">
      <div style="padding-bottom: 0px; border-color: rgb(146, 130, 133); border-style: solid; border-width: 0px 0px 1px; padding-left: 5px;">
        <span style="font-size: 9pt;">
          <b>
            {{ subject }}
          </b>
        </span>
      </div>
      <div style="padding: 10px;">
        <p style="margin-bottom: 5px; margin: 0px;" class="">
          Dear
          <b>
            {{ username | upper }}
          </b>
          <br>
          <span style="font-size: 11pt;">
            A design review request for the codepace has been assigned to you for review. The following details are provided below:
            <b>
              {{ (username | getUser).Email }}
            </b>
          </span>
        </p>
        <div style="margin-top: 10px; margin-bottom: 10px;" class="">
          {% for key,value in table %}
          <table style="width: 100%; margin-top: 0px; margin-bottom: 0px;" class="">
            <tbody>
              <tr>
                <th style="border: 1px solid rgb(204, 204, 204); padding: 0px 10px; background: rgb(240, 240, 240); vertical-align: top; text-align: left; width: 35%;" class="">
                  <span style="font-size: 8pt;">
                    {{ key }}
                  </span>
                </th>
                <th style="border: 1px solid rgb(204, 204, 204); padding: 0px 10px; background: rgb(240, 240, 240); width: 65%; text-align: left;" class="">
                  <span style="font-size: 10.6667px;">
                    {% if value.match('^http') %}
                  </span>
                  <a href="{{value}}" target="_blank" title="{{value}}" style="">
                    <span style="font-size: 8pt;">
                      Click here
                    </span>
                  </a>
                  <span style="font-size: 10.6667px;">
                    &nbsp;
                    {% else %}
                    {{value}}
                    {% endif %}
                  </span>
                </th>
              </tr>
            </tbody>
          </table>
          {% endfor %}
        </div>
        <hr>
        <div style="margin: 0px;">
          <b>
            Best Regards
          </b>
          <br>
          {{ applicationName }}
        </div>
      </div>
    </div>
    <div style="border-style: solid; border-width: 1px 0px 0px; border-color: rgb(146, 130, 133); padding: 0px; background-color: rgb(171, 55, 122); text-align: center; height: 30px; margin-top: 0px; margin-bottom: 0px;">
      <a href="https://codespace.kethan.dev/" target="_blank" style="text-decoration: none;">
        <font color="#ffffff">
          APP LINK
        </font>
      </a>
      <font color="#ffffff" style="background-color: rgb(171, 55, 122);">
        &nbsp;This mail is generated by system
      </font>
    </div>
  </div>
</div>`,
    context: JSON.stringify(
      {
        applicationName: "Codespace Application",
        subject: "Codepace Review Request",
        username: "vemuri kethan",
        table: {
          "App URL": "https://Codespace-ui-dev.icp.com",
        },
      },
      null,
      2,
    ),
    filters: `{
  getUser: async (username) => {
    const res = await fetch('https://gam.intra.infineon.com/rest/ad/users', {
      credentials: 'include'
    });
    const data = await res.json();
    if (data.length > 0) {
      return data[0];
    }
  }
}`,
  },
];
