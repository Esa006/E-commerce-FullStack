{{-- This file is used for menu items by any Backpack v7 theme --}}

{{-- Dashboard --}}
<x-backpack::menu-item title="{{ trans('backpack::base.dashboard') }}" icon="la la-home"
    :link="backpack_url('dashboard')" />

{{-- Users Module --}}
<x-backpack::menu-item title="Users" icon="la la-users" :link="backpack_url('user')" />
<x-backpack::menu-item title="Products" icon="la la-tshirt" :link="backpack_url('product')" />
<x-backpack::menu-item title="Orders" icon="la la-shopping-cart" :link="backpack_url('order')" />
<x-backpack::menu-item title="Categories" icon="la la-list" :link="backpack_url('category')" />
<x-backpack::menu-item title="Product Reviews" icon="la la-star" :link="backpack_url('product-review')" />

<li class="nav-separator">Observability</li>
<x-backpack::menu-item title="Error Logs" icon="la la-bug" :link="backpack_url('error-log')" />





