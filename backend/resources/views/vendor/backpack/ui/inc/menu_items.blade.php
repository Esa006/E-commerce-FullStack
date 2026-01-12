{{-- This file is used for menu items by any Backpack v7 theme --}}

{{-- Dashboard --}}
<x-backpack::menu-item title="{{ trans('backpack::base.dashboard') }}" icon="la la-home"
    :link="backpack_url('dashboard')" />

{{-- Users Module --}}
<x-backpack::menu-item title="Users" icon="la la-users" :link="backpack_url('user')" />
<x-backpack::menu-item title="Products" icon="la la-question" :link="backpack_url('product')" />
<x-backpack::menu-item title="Orders" icon="la la-question" :link="backpack_url('order')" />
<x-backpack::menu-item title="Categories" icon="la la-question" :link="backpack_url('category')" />